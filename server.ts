import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes bridge to your AWS EC2 Instance
  app.post("/api/tts", async (req, res) => {
    // Wait for the EC2 Backend URL variable
    const ec2Url = process.env.FISH_SPEECH_BACKEND_URL || process.env.VITE_FISH_SPEECH_BACKEND_URL;
    
    if (!ec2Url) {
      return res.status(500).json({ 
        error: "Backend URL is not configured. Setup FISH_SPEECH_BACKEND_URL in .env" 
      });
    }

    // TODO: We will implement the exact fetch request to your EC2 instance here 
    // once I have the API spec from the Patreon guide!
    res.json({ message: "API bridge is ready. Awaiting parameters!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
