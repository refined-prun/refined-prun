import { Module } from '../ModuleRunner';
import { getBuffersFromList, setSettings } from '../util';
import { Selector } from '../Selector';
import { appendStyle, RPrunStylesheet, Style } from '../Style';

export class ChatDeleteButton implements Module {
  private tag = 'pb-chat-delete';

  private pmmgSettings;

  constructor(pmmgSettings) {
    this.pmmgSettings = pmmgSettings;
  }

  cleanup() {
    // Nothing to clean up
  }

  run(allBuffers) {
    let buffers = getBuffersFromList('COMP ', allBuffers);
    buffers.forEach(buffer => {
      addChatDeleteToggle(buffer, this.pmmgSettings, this.tag);
    });

    buffers = getBuffersFromList('COMG ', allBuffers);
    buffers.forEach(buffer => {
      addChatDeleteToggle(buffer, this.pmmgSettings, this.tag);
    });

    buffers = getBuffersFromList('COMU ', allBuffers);
    buffers.forEach(buffer => {
      addChatDeleteToggle(buffer, this.pmmgSettings, this.tag);
    });
  }
}

function addChatDeleteToggle(buffer, pmmgSettings, tag) {
  const channelControls = buffer.querySelector(Selector.ChannelControls);
  if (!channelControls || channelControls.classList.contains(tag)) {
    return;
  }
  channelControls.classList.add(tag);

  let chatToggle = document.createElement('div');
  chatToggle.innerHTML = `<div class="SelectButton__container___vjN14Xf"><span class="RadioItem__container___CSczqmG"><div class="RadioItem__indicator___QzQtjhA"></div><div class="RadioItem__value___Yd1Gt1T fonts__font-regular___Sxp1xjo type__type-small___pMQhMQO">disable delete</div></span></div>`;

  let joinToggle = document.createElement('div');
  joinToggle.innerHTML = `<div class="SelectButton__container___vjN14Xf"><span class="RadioItem__container___CSczqmG"><div class="RadioItem__indicator___QzQtjhA"></div><div class="RadioItem__value___Yd1Gt1T fonts__font-regular___Sxp1xjo type__type-small___pMQhMQO">hide join</div></span></div>`;
  joinToggle = joinToggle.firstChild as HTMLDivElement;
  if (!joinToggle) {
    return;
  }

  chatToggle = chatToggle.firstChild as HTMLDivElement;
  if (!chatToggle) {
    return;
  }

  channelControls.appendChild(chatToggle);
  channelControls.appendChild(joinToggle);

  if (pmmgSettings['PMMGExtended']['chat_delete_hidden']) {
    const chatIndicator = chatToggle.querySelector(Selector.RadioIndicator) as HTMLElement;
    if (!chatIndicator) {
      return;
    }

    chatIndicator.classList.add(...Style.RadioButtonToggled);
  }

  if (pmmgSettings['PMMGExtended']['join_leave_hidden']) {
    const chatIndicator = joinToggle.querySelector(Selector.RadioIndicator) as HTMLElement;
    if (!chatIndicator) {
      return;
    }

    chatIndicator.classList.add(...Style.RadioButtonToggled);
  }

  chatToggle.addEventListener('click', () => {
    pmmgSettings['PMMGExtended']['chat_delete_hidden'] = !pmmgSettings['PMMGExtended']['chat_delete_hidden'];

    const chatIndicator = chatToggle.querySelector(Selector.RadioIndicator) as HTMLElement;
    if (!chatIndicator) {
      return;
    }

    if (pmmgSettings['PMMGExtended']['chat_delete_hidden']) {
      chatIndicator.classList.remove(...Style.RadioButtonUnToggled);
      chatIndicator.classList.add(...Style.RadioButtonToggled);
      appendStyle(RPrunStylesheet.hideChatDelete);
    } else {
      chatIndicator.classList.remove(...Style.RadioButtonToggled);
      chatIndicator.classList.add(...Style.RadioButtonUnToggled);
      const chatStyle = document.getElementById('pmmg-chat-delete-style');
      if (chatStyle) {
        // Style exists: Remove it.
        chatStyle.remove();
      }
    }

    setSettings(pmmgSettings);
  });

  joinToggle.addEventListener('click', () => {
    pmmgSettings['PMMGExtended']['join_leave_hidden'] = !pmmgSettings['PMMGExtended']['join_leave_hidden'];

    const chatIndicator = joinToggle.querySelector(Selector.RadioIndicator) as HTMLElement;
    if (!chatIndicator) {
      return;
    }

    if (pmmgSettings['PMMGExtended']['join_leave_hidden']) {
      chatIndicator.classList.remove(...Style.RadioButtonUnToggled);
      chatIndicator.classList.add(...Style.RadioButtonToggled);
      appendStyle(RPrunStylesheet.hideChatJoinLeave);
    } else {
      chatIndicator.classList.remove(...Style.RadioButtonToggled);
      chatIndicator.classList.add(...Style.RadioButtonUnToggled);
      const chatStyle = document.getElementById('pmmg-chat-join-style');
      if (chatStyle) {
        // Style exists: Remove it.
        chatStyle.remove();
      }
    }

    setSettings(pmmgSettings);
  });
}
