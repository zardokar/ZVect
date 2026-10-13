// bus.js — LOGIC (stateful, no DOM): the LinkedSelection bus of plan §4.4. Views never import each other; they talk here.
// message = { type, source, ids }; a listener registered with its own view id never receives that view's messages (no echo).

export const BUS_EVENTS = ["hover", "select", "step", "clear"];

function known(type) {
  if (!BUS_EVENTS.includes(type)) {
    throw new Error("tviz: unknown bus event: " + type);
  }
}

export function createBus() {
  const listeners = new Map(BUS_EVENTS.map((t) => {
    return [t, []];
  }));
  const latest = new Map();

  function off(type, fn) {
    known(type);
    listeners.set(type, listeners.get(type).filter((entry) => {
      return entry.fn !== fn;
    }));
  }

  // fn(message); owner = the listening view's id (its own messages are skipped); returns an unsubscribe function
  function on(type, fn, owner) {
    known(type);
    listeners.get(type).push({ fn, owner: owner === undefined ? null : owner });
    return () => {
      off(type, fn);
    };
  }

  function emit(msg) {
    known(msg.type);
    const message = { type: msg.type, source: msg.source, ids: msg.ids.map((id) => {
      return { ...id };
    }) };
    if (message.type === "clear") {
      latest.clear();
    } else {
      latest.set(message.type, message);
    }
    for (const entry of listeners.get(message.type).slice()) {
      if (entry.owner === null || entry.owner !== message.source) {
        entry.fn(message);
      }
    }
  }

  function send(type, ids, source) {
    emit({ type, source, ids });
  }

  return {
    on,
    off,
    emit,
    hover(ids, source) {
      send("hover", ids, source);
    },
    select(ids, source) {
      send("select", ids, source);
    },
    step(ids, source) {
      send("step", ids, source);
    },
    clear(source) {
      send("clear", [], source);
    },
    last(type) {
      return latest.has(type) ? latest.get(type) : null;
    },
  };
}
