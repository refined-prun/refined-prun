import { hourFormatter, dateFormatter } from '../util';
import xit from './xit-registry';
import features from '@src/feature-registry';
import { h } from 'preact';
import { useEffect, useState } from 'preact/compat';
import { Loading } from '@src/components/Loading';

interface ChatMessage {
  MessageTimestamp: number;
  MessageType: 'CHAT' | 'JOINED' | 'LEFT';
  UserName: string;
  MessageText: string;
}

function CHAT(props: { parameters: string[] }) {
  const { parameters } = props;
  const parameter = parameters[1];
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([] as ChatMessage[]);
  useEffect(() => {
    fetch(`https://rest.fnar.net/chat/display/${parameter}`)
      .then(response => response.json())
      .then(data => {
        setIsLoaded(true);
        setData(data);
      });
  }, [parameter]);

  if (!isLoaded) {
    return <Loading />;
  }

  const lines: h.JSX.Element[] = [];
  for (const messageData of data) {
    const parts: h.JSX.Element[] = [];
    switch (messageData.MessageType) {
      case 'CHAT': {
        parts.push(<div class="chat-name">{messageData.UserName}</div>);
        parts.push(<div class="chat-message">{messageData.MessageText}</div>);
        break;
      }
      case 'JOINED': {
        parts.push(<div class="chat-name" />);
        parts.push(
          <div class="chat-message" style={{ fontStyle: 'italic' }}>
            {messageData.UserName} joined.
          </div>,
        );
        break;
      }
      case 'LEFT': {
        parts.push(<div class="chat-name" />);
        parts.push(
          <div class="chat-message" style={{ fontStyle: 'italic' }}>
            {messageData.UserName} left.
          </div>,
        );
        break;
      }
    }

    lines.push(
      <div class="chat-line">
        <div>
          <div class="time-date">{dateFormatter.format(new Date(messageData.MessageTimestamp))}</div>
          <div class="time-date" style={{ color: '#999999' }}>
            {hourFormatter.format(new Date(messageData.MessageTimestamp))}
          </div>
        </div>
        {parts}
      </div>,
    );
  }

  return (
    <div style={{ height: '100%', flexGrow: 1, paddingTop: '4px' }}>
      <div class="title">{parameter} Global Site Owners</div>
      {lines}
    </div>
  );
}

function init() {
  xit.add({
    command: 'CHAT',
    name: 'FIO CHAT',
    component: parameters => {
      if (parameters.length < 2) {
        return <div>Error! Not Enough Parameters!</div>;
      }

      return <CHAT parameters={parameters} />;
    },
  });
}

features.add({
  id: 'xit-chat',
  init,
});
