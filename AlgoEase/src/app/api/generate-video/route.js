



export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { code, code_explanation, time_and_space_complexity } = req.body;

    // Construct text to be spoken
    const textToSpeak = `Here is the analysis of your code. ${code_explanation}. The time and space complexity is ${time_and_space_complexity}.`;

    try {
        const response = await fetch('https://api.d-id.com/talks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DID_API_KEY}`
            },
            body: JSON.stringify({
                source_url: "https://your-avatar-url.com/avatar.png", // Use a pre-existing avatar
                script: {
                    type: "text",
                    input: textToSpeak
                }
            })
        });

        const data = await response.json();

        if (data.id) {
            // Wait for video to be ready
            const videoUrl = `https://api.d-id.com/talks/${data.id}`;
            res.status(200).json({ videoUrl });
        } else {
            res.status(500).json({ error: 'Failed to generate video' });
        }
    } catch (error) {
        console.error('D-ID API Error:', error);
        res.status(500).json({ error: 'Error generating video' });
    }
}
