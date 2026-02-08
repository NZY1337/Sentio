# react compare - npm i react-compare-slider - https://react-compare-slider.vercel.app/?path=/docs/docs-transition--docs

# https://theboroer.github.io/localtunnel-www/ - ngrok alternative

# https://havenly.com/ - interior design platform

# CLERK

- https://www.youtube.com/watch?v=3rGDJDmuZ54 - roles and permissions clerk

- https://clerk.com/docs/references/nextjs/basic-rbac - roles and permissions clerk

- https://www.youtube.com/watch?v=5GG-VUvruzE&t=1268s - clerk roles and permissions - WebDev

- https://github.com/ishaangupta-YB/clerk-webhook-tutorial/blob/main/app/api/webhooks/clerk/route.ts - clerk webHook

# OPEN AI

- https://platform.openai.com/docs/guides/production-best-practices: production best practices
- cost calculator: https://chatgpt.com/share/683b1f88-36e4-800f-a22a-a601cb09cc7d

- CALCULATIONS:
  usage: {
  input_tokens: 111,
  input_tokens_details: { image_tokens: 0, text_tokens: 111 },
  output_tokens: 4160,
  total_tokens: 4271
  }

# SUPABASE:

- tutorial: https://www.youtube.com/watch?v=kyphLGnSz6Q&t=3877s

# use node v 21.0.0: nvm use 21.0.0

# MUI CONFIGURATIONS:

- theming: https://codesandbox.io/embed/zhlj7t?module=/src/Demo.tsx&fontsize=12

# VAKKO WEDDING EFFECT: 
https://www.vakko.com/wedding

# open ai API call

- To transfer files from frontend → backend, we use Multer.
- Multer stores uploaded images in memory as Buffer objects.
- To send these images from the server to OpenAI's image API, we use the toFile() utility from  the OpenAI SDK.
- When using Multer:
- We pass each file.buffer (from req.files) into toFile(...).
- This converts the in-memory buffer into a File-like object compatible with OpenAI's API.
- The code in the OpenAI documentation (below) assumes that image files are already on disk:
    # where all the imageFiles are importend from local file system (fs) - not from memory
    const imageFiles = [
        "bath-bomb.png",
        "body-lotion.png",
        "incense-kit.png",
        "soap.png",
    ];

    const images = await Promise.all(
        imageFiles.map(async (file) =>
            await toFile(fs.createReadStream(file), null, {
                type: "image/png",
            })
        ),
    );

 - How Long Do Uploaded Files Stay in Memory?
    * 🕒 Only for the duration of that HTTP request.
    * Once your handler/controller finishes processing (e.g., sending to OpenAI), the request  ends and the Buffer is garbage collected.
    * So it doesn't persist across requests, nor is it stored in disk or database.