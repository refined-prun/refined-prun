interface Message {
  type: string;
  data?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageHandler = (data: any) => void | boolean;

type MessageHandlers = { [type: string]: MessageHandler };

const registry = new Map<string, MessageHandler[]>();

export function onApiMessage(handlers: MessageHandlers) {
  for (const type in handlers) {
    let list = registry.get(type);
    if (!list) {
      list = [];
      registry.set(type, list);
    }
    list.push(handlers[type]);
  }
}

export function dispatch(message: Message) {
  const handlers = registry.get(message.type);
  let changed = false;
  if (handlers) {
    for (const handler of handlers) {
      const result = handler(message.data);
      if (result) {
        changed = true;
      }
    }
  }
  return changed;
}
