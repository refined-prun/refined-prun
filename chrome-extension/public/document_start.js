const script = document.createElement('script');
script.src = (chrome ?? browser).runtime.getURL('page_script.js');
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);
