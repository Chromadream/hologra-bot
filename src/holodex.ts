import axios from "axios";

const getHologra = async (holodexApiKey: string): Promise<string> => {
    try {
        const response = await fetch("https://holodex.net/api/v2/search/videoSearch", {
            method: "POST", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-APIKEY': holodexApiKey
            }, body: JSON.stringify({
                "sort": "newest",
                "lang": [
                    "en",
                    "ja"
                ],
                "target": [
                    "stream",
                    "clip"
                ], "vch": ["UCJFZiqLMntJufDCHc6bQixg"],
                "topic": ["Animation"],
                "org": [
                    "Hololive"
                ],
                "comment": [],
                "paginated": true,
                "offset": 0,
                "limit": 1
            })
        });
        const json = (await response.json()) as any;
        const latest = json.items[0];
        console.log(`current hologra is ${latest.title}, id is ${latest.id}`);
        return latest.id;
    } catch (error) {
        console.error(error);
        return "";
    }
}

export { getHologra }