// core/bus.js acceptance (plan §4.4): on/off/emit, hover/select/step/clear helpers, unsubscribe, a view never gets its own echo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createBus, BUS_EVENTS } from "../core/bus.js";

function recorder() {
  const got = [];
  const fn = (msg) => {
    got.push(msg);
  };
  return { got, fn };
}

test("message shape and the four helpers", () => {
  assert.deepEqual(BUS_EVENTS, ["hover", "select", "step", "clear"]);
  const bus = createBus();
  const r = recorder();
  for (const type of BUS_EVENTS) {
    bus.on(type, r.fn);
  }
  bus.hover([{ kind: "token", i: 2 }], "lines");
  bus.select([{ kind: "head", layer: 0, h: 1 }], "heads");
  bus.step([{ kind: "step", index: 3 }], "attention");
  bus.clear("embed");
  assert.deepEqual(r.got, [
    { type: "hover", source: "lines", ids: [{ kind: "token", i: 2 }] },
    { type: "select", source: "heads", ids: [{ kind: "head", layer: 0, h: 1 }] },
    { type: "step", source: "attention", ids: [{ kind: "step", index: 3 }] },
    { type: "clear", source: "embed", ids: [] },
  ]);
});

test("on returns an unsubscribe function; off removes the listener", () => {
  const bus = createBus();
  const a = recorder();
  const b = recorder();
  const offA = bus.on("hover", a.fn);
  bus.on("hover", b.fn);
  bus.hover([], "x");
  offA();
  bus.hover([], "x");
  bus.off("hover", b.fn);
  bus.hover([], "x");
  assert.equal(a.got.length, 1);
  assert.equal(b.got.length, 2);
});

test("echo rule: a listener registered with its view id does not receive messages from that view", () => {
  const bus = createBus();
  const lines = recorder();
  const heat = recorder();
  bus.on("hover", lines.fn, "lines");
  bus.on("hover", heat.fn, "attention");
  bus.hover([{ kind: "token", i: 1 }], "lines");
  assert.equal(lines.got.length, 0);
  assert.equal(heat.got.length, 1);
});

test("last(type) remembers the latest message for views that mount later; clear resets hover and select", () => {
  const bus = createBus();
  assert.equal(bus.last("select"), null);
  bus.select([{ kind: "token", i: 4 }], "embed");
  bus.hover([{ kind: "cell", i: 1, j: 2 }], "attention");
  assert.deepEqual(bus.last("select").ids, [{ kind: "token", i: 4 }]);
  bus.clear("embed");
  assert.equal(bus.last("select"), null);
  assert.equal(bus.last("hover"), null);
});

test("a listener removed during emit does not break the others; unknown events throw", () => {
  const bus = createBus();
  const later = recorder();
  const off = bus.on("step", () => {
    off();
  });
  bus.on("step", later.fn);
  bus.step([], "player");
  bus.step([], "player");
  assert.equal(later.got.length, 2);
  assert.throws(() => {
    bus.on("drag", later.fn);
  }, /drag/);
  assert.throws(() => {
    bus.emit({ type: "drag", source: "x", ids: [] });
  }, /drag/);
});

test("separate buses do not share listeners; ids are copied, not shared", () => {
  const one = createBus();
  const two = createBus();
  const r = recorder();
  one.on("hover", r.fn);
  two.hover([], "x");
  assert.equal(r.got.length, 0);
  const ids = [{ kind: "token", i: 0 }];
  one.hover(ids, "x");
  ids.push({ kind: "token", i: 1 });
  assert.equal(r.got[0].ids.length, 1);
});
