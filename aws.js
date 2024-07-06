const botToken = "";
const awsUrl = "";


const baseUrl = `https://api.telegram.org/bot${botToken}/`;

export const handler = async (event) => {
	if (event.requestContext.http.method == "POST") {
		const json = JSON.parse(event.body);
		try {
			const msg = json.message;
			const chat = msg.chat;
			if (msg.text && msg.text.includes("/capacity")) {
				const cap = await getCapacity();
				await sendMessage(chat.id, `Current boulderbar linz capacity: ${cap}%`)
			}
		} catch(e) {
			console.log()
		}
	}	
	const response = {
		statusCode: 200,
		body: "ack",
	};
	return response;
};


async function getCapacity() {
	return (await (await fetch("https://boulderbar.net/wp-json/boulderbar/v1/capacity?locations=260")).json()).data[0].capacity;
}

async function sendMessage(chatId, msg) {
	await fetch(baseUrl + "sendMessage", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chat_id: chatId,
			text: msg
		})
	});
}

// setup:
async function setup() {
	const req = await fetch(baseUrl + "setWebhook", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			url: awsUrl,
			allowed_updates: ["message"],
			drop_pending_updates: true
		})
	});
	console.log(await req.text())
}