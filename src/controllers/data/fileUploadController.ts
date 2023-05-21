import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
import { spawn } from "child_process";

const assemblyai = require("assemblyai-v2-node-sdk");
const client = new assemblyai.AssemblyClient(process.env.API_SPEECH2TEXT);

// collection

const Podcast = require("../../models/data/podcastModel");

const PodcastUser = require("../../models/data/podcastUserModel");

const audioFileUpload = asyncHandler(async (req: any, res: Response) => {
  const userId = req.body.userId;
  const userExits = await PodcastUser.findOne({
    user: userId,
  });

  try {
    let text: string = "";
    const audioFile = req.files.file;
    const backgroundFile = req.files.background;
    if (!audioFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let urlCloudinary = audioFile[0].path;
    // return transcript from python file
    const transcript = await client.createTranscript({
      audio_url: urlCloudinary,
    });
    await client.pollForTranscript(transcript.id).then((result: any) => {
      text = result.text;
    });

    const podcastUser = new Podcast({
      user: userId,
      audio: urlCloudinary,
      background: backgroundFile
        ? backgroundFile[0].path
        : PodcastUser.background,
      caption: req.body.caption,
      content: text,
    });

    await podcastUser.save();

    if (userExits) {
      await PodcastUser.updateOne(
        { user: userId },
        {
          $push: {
            podcasts: podcastUser._id,
          },
        }
      );
    } else {
      await PodcastUser.create({
        user: userId,
        podcasts: podcastUser._id,
      });
    }

    // Return a success message
    res.json({
      message: "File uploaded successfully!",
      result: text,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading file", error: err });
    console.log(err);
  }
});

const audioUploadToPython = asyncHandler(async (req: any, res: Response) => {
  const userId = req.body.userId;
  let responseSent = false; // flag variable
  let result = "";

  const userExits = await PodcastUser.findOne({
    user: userId,
  });

  try {
    const audioFile = req.files.file;
    const backgroundFile = req.files.background;
    if (!audioFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let urlCloudinary = audioFile[0].path;

    const child = spawn("python", ["../../viet-asr/app.py", urlCloudinary]);

    // listen for data from stdout and stderr
    child.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      result += data;
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      result += data;
    });

    // listen for when the child process exits
    child.on("exit", async (code, signal) => {
      console.log(
        `child process exited with code ${code} and signal ${signal}`
      );
      if (code === 0) {
        // success case
        let transcriptDecode = result.slice(result.indexOf("transcriptText:"));
        // english
        let transcriptText = transcriptDecode.replace("transcriptText: ", "");
        let transcript = transcriptText.replace("\r\n", "");
        // vietnamese
        // let transcriptText = decodeURIComponent(transcriptDecode);
        // let transcript = decodeURIComponent(JSON.parse(`"${transcriptText}"`));
        // let transcript = decodeURIComponent(transcriptText);

        const podcastUser = new Podcast({
          user: userId,
          audio: urlCloudinary,
          background: backgroundFile
            ? backgroundFile[0].path
            : PodcastUser.background,
          caption: req.body.caption,
          content: transcript,
        });

        await podcastUser.save();

        if (userExits) {
          await PodcastUser.updateOne(
            { user: userId },
            {
              $push: {
                podcasts: podcastUser._id,
              },
            }
          );
        } else {
          await PodcastUser.create({
            user: userId,
            podcasts: podcastUser._id,
          });
        }
        res.status(200).json({ transcript });
      } else {
        // error case
        res
          .status(500)
          .json({ message: "Error processing audio file", result });
      }
    });
  } catch (err) {
    if (!responseSent) {
      res.status(500).json({ message: "Error uploading file", error: err });
      responseSent = true;
    }
    console.log(err);
  }
});

export { audioFileUpload, audioUploadToPython };
