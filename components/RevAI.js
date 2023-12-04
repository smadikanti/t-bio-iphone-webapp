export let genieListening = false;
let statusElement;
export let tableElement;
let finalsReceived = 0;
export let currentCell = null;
let audioContext;
let websocket;
export let revTranscriptFromJSFile = '';
export let tempStorageUntilLineIsCompleted = '';
export let contentFromTableElement = 'first';
export let sharedTranscript = [];

let totalConversationLength = 0;
let lastQuestionLength = 0;
let completedQuestionsLength = 0;

export function doStream() {
  statusElement = document.getElementById('status');
  tableElement = document.getElementById('messages');
  finalsReceived = 0;
  currentCell = null;
  audioContext = new (window.AudioContext || window.WebkitAudioContext)();
  let transcriptBuffer = [];

  const access_token =
    '02lSZjnr0zqGNJC2pskPs_--fFwEmGfd4O08RJM80Aauwx7PZI0tWaWB4MtFqCd6c2pGMhMWes3CGgmRx7IWGo1W8pQqk';
  const content_type = `audio/x-raw;layout=interleaved;rate=${audioContext.sampleRate};format=S16LE;channels=1`;
  const baseUrl = 'wss://api.rev.ai/speechtotext/v1/stream';
  const query = `access_token=${access_token}&content_type=${content_type}`;
  websocket = new WebSocket(`${baseUrl}?${query}`);

  websocket.onopen = onOpen;
  websocket.onclose = onClose;
  websocket.onmessage = onMessage;
  websocket.onerror = console.error;

  var button = document.getElementById('streamButton');
  button.onclick = endStream;
  button.innerHTML = 'Stop';
}

export function endStream() {
  if (websocket) {
    websocket.send('EOS');
    websocket.close();
  }
  if (audioContext) {
    audioContext.close();
  }
}

function onOpen(event) {
  genieListening = true;
  resetDisplay();
  console.log('Stream opened');
  navigator.mediaDevices.getUserMedia({ audio: true }).then((micStream) => {
    audioContext.suspend();
    var scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
    var input = audioContext.createMediaStreamSource(micStream);
    scriptNode.addEventListener('audioprocess', (event) =>
      processAudioEvent(event),
    );
    input.connect(scriptNode);
    scriptNode.connect(audioContext.destination);
    audioContext.resume();

    var button = document.getElementById('streamButton');
    button.classList.add('bg-black');
    button.classList.remove('bg-red-600');
    button.innerHTML = 'Stop audio';
  });
}

function onClose(event) {
  genieListening = false;
  statusElement.innerHTML = `Closed with ${event.code}: ${event.reason}`;

  var button = document.getElementById('streamButton');
  button.classList.add('bg-red-600');
  button.classList.remove('bg-green-600');
  button.innerHTML = 'Share audio';
}

let lastIndex = 0;
let contentFromCurrentRevCell = '';
export let transcriptBuffer = '';
let lastTranscriptState = '';

function onMessage(event) {
  var data = JSON.parse(event.data);
  switch (data.type) {
    case 'connected':
      console.log('Stream connected');
      break;
    case 'partial':
      currentCell.innerHTML = parseResponse(data);
      contentFromCurrentRevCell = currentCell.innerHTML;

      transcriptBuffer =
        transcriptBuffer.slice(0, lastIndex) + contentFromCurrentRevCell;
      sharedTranscript = transcriptBuffer
      break;
    case 'final':
      currentCell.innerHTML = parseResponse(data);
      contentFromCurrentRevCell = currentCell.innerHTML;
      if (data.type == 'final') {
        finalsReceived++;
        var row = tableElement.insertRow(finalsReceived);
        currentCell = row.insertCell(0);
      }

      transcriptBuffer =
        transcriptBuffer.slice(0, lastIndex) + contentFromCurrentRevCell + ' ';
      sharedTranscript = transcriptBuffer
      lastIndex = transcriptBuffer.length;
      break;
    default:
      console.error('Received unexpected message');
      break;
  }
}

export function getTranscript() {
  console.log("gettranscript method log")
  return transcriptBuffer;
}

export function getLatestTranscript() {
  let newPart = transcriptBuffer.slice(lastTranscriptState.length);
  lastTranscriptState = transcriptBuffer;
  return newPart;
}

export function resetDisplay() {
  let finalsReceived = 0;
  while (tableElement.hasChildNodes()) {
    tableElement.removeChild(tableElement.firstChild);
  }
  var row = tableElement.insertRow(0);
  currentCell = row.insertCell(0);
}

export const updateTempBuffer = (newValue) => {
  tempStorageUntilLineIsCompleted = tempStorageUntilLineIsCompleted + newValue;
};

export const updateRevTranscriptInThisFile = (newValue) => {
  revTranscriptFromJSFile = revTranscriptFromJSFile + revTranscriptBuffer;
  revTranscriptBuffer = '';
};

export const getRevTranscriptInThisFile = () => {
  return revTranscriptFromJSFile;
};

export const resetRevTranscriptInThisFile = () => {
  var tableElement = document.getElementById('transcript-table');
  if (tableElement) {
    var tdElements = tableElement.querySelectorAll('td');
    var tdContents = [];
    tdElements.forEach(function (tdElement) {
      var content = tdElement.innerText;
      tdContents.push(content);
    });
  }

  if (tdContents) {
    totalConversationLength = tdContents.length;
  } else {
    totalConversationLength = 0;
  }

  completedQuestionsLength += lastQuestionLength;
  revTranscriptFromJSFile = '';
  contentFromTableElement = '';
};

export function updateFullContentUntilNow(tableElement) {
  let tdElements = tableElement.querySelectorAll('td');
  transcriptBuffer = Array.from(tdElements, (tdElement) => tdElement.innerText);
}

export function updateAllTableContentToVariable(tableElement) {
  updateFullContentUntilNow(tableElement);

  let totalConversationLength = transcriptBuffer.length;
  transcriptBuffer.splice(0, completedQuestionsLength);
  let lastQuestionLength = transcriptBuffer.length;
  let runningFullTranscript = transcriptBuffer.join('');

  onTranscriptUpdate(runningFullTranscript);
}

function processAudioEvent(e) {
  if (
    audioContext.state === 'suspended' ||
    audioContext.state === 'closed' ||
    !websocket
  ) {
    return;
  }

  let inputData = e.inputBuffer.getChannelData(0);

  let output = new DataView(new ArrayBuffer(inputData.length * 2));
  for (let i = 0; i < inputData.length; i++) {
    let multiplier = inputData[i] < 0 ? 0x8000 : 0x7fff;
    output.setInt16(i * 2, (inputData[i] * multiplier) | 0, true);
  }

  let intData = new Int16Array(output.buffer);
  let index = intData.length;
  while (index-- && intData[index] === 0 && index > 0) {}
  websocket.send(intData.slice(0, index + 1));
}

function parseResponse(response) {
  var message = '';
  for (var i = 0; i < response.elements.length; i++) {
    message +=
      response.type == 'final'
        ? response.elements[i].value
        : `${response.elements[i].value} `;
  }
  return message;
}
