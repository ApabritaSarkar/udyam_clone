import express = require("express");
import { Request, Response } from "express";
import cors = require("cors");
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const patterns = {
  pan: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
  aadhaar: /^[0-9]{12}$/,
  email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  mobile: /^[6-9][0-9]{9}$/,
  pincode: /^[0-9]{6}$/
};

const detectRule = (key: string, pattern?: string) => {
  if (pattern) return { regex: new RegExp(pattern), message: `Invalid ${key}` };
  const k = key.toLowerCase();
  if (k.includes("pan")) return { regex: patterns.pan, message: "Invalid PAN" };
  if (k.includes("aadhaar")) return { regex: patterns.aadhaar, message: "Invalid Aadhaar" };
  if (k.includes("email")) return { regex: patterns.email, message: "Invalid Email" };
  if (k.includes("mobile")) return { regex: patterns.mobile, message: "Invalid Mobile" };
  if (k.includes("pin")) return { regex: patterns.pincode, message: "Invalid Pincode" };
  return null;
};

app.post("/submit", async (req: Request, res: Response) => {
  const { step, data } = req.body as { step: number; data: Record<string, any> };
  if (!step || !data) return res.status(400).json({ error: "step & data required" });

  const shape: Record<string, z.ZodTypeAny> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      // Checkbox validation
      shape[key] = z.literal(true).refine(val => val === true, {
        message: `${key} must be checked`
      });
    } else {
      let rule = z.string().min(1, `${key} is required`);
      const detected = detectRule(key);
      if (detected) {
        rule = rule.regex(detected.regex, detected.message);
      }
      shape[key] = rule;
    }
  });

  const Schema = z.object(shape);
  const parsed = Schema.safeParse(data);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten()
    });
  }

  const saved = await prisma.submission.create({
    data: { step, data }
  });

  res.json({ ok: true, id: saved.id });
});

app.get("/submissions", async (req: Request, res: Response) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const all = await prisma.submission.findMany({ orderBy: { createdAt: "desc" } });
  res.json(all);
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
