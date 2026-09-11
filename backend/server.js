require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const authMiddleware = require('./Middleware/authMiddleware');
const AnalysisHistory = require('./models/AnalysisHistory');
const axios = require('axios');
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:[ "http://localhost:5173","http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=> {
    res.send(' server chal raha hai!');
});

  app.get('/api/review-code', async (req, res) => {
  try {
    const { downloadUrl } = req.query;
    
    // Step 1: GitHub se asli code lao
    const fileResponse = await axios.get(downloadUrl);
    const codeContent = fileResponse.data;
    
    // Step 2: AI ko bhejo
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze this JavaScript code and return ONLY a valid JSON (no markdown formatting, no extra text) in this exact structure:
{
  "issues": [
    {
      "type": "bug",
      "description": "short description",
      "severity": "high",
      "suggestion": "how to fix it"
    }
  ],
  "overallScore": 7
}

Code to review:
${codeContent}`;
    
    const result = await model.generateContent(prompt);
    let review = result.response.text();
    
    review = review.replace(/```json/g, '').replace(/```/g, '').trim();
    const reviewData = JSON.parse(review);
    
    res.json(reviewData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Review nahi ho paya' });
  }
});
app.get('/api/files/:owner/:repoName', async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/contents`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Files fetch nahi ho payi' });
  }
});
app.get('/api/file-content', async (req, res) => {
  try {
    const { downloadUrl } = req.query;
    
    const response = await axios.get(downloadUrl);
    
    res.json({ content: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'File content nahi mila' });
  }
});
app.get('/api/generate-docs', async (req, res) => {
  try {
    const { downloadUrl } = req.query;
    
    // Step 1: GitHub se asli code lao
    const fileResponse = await axios.get(downloadUrl);
    const codeContent = fileResponse.data;
    
    // Step 2: AI ko documentation banane ke liye bhejo
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze this code and generate professional documentation for it. Return ONLY a valid JSON (no markdown formatting, no extra text) in this exact structure:
{
  "summary": "one paragraph explaining what this code does",
  "functions": [
    {
      "name": "function name",
      "purpose": "what it does",
      "parameters": "what parameters it takes"
    }
  ],
  "readme": "a short markdown-style README content explaining setup and usage"
}

Code to document:
${codeContent}`;
    
    const result = await model.generateContent(prompt);
    let docs = result.response.text();
    
    docs = docs.replace(/```json/g, '').replace(/```/g, '').trim();
    const docsData = JSON.parse(docs);
    
    res.json(docsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Documentation generate nahi ho payi' });
  }
});
app.get('/api/test-docs', async (req, res) => {
  try {
    const sampleCode = `
function calculateTotal(price, tax) {
  return price + (price * tax);
}

function greetUser(name) {
  return "Hello, " + name + "! Welcome to our app.";
}

function isEven(number) {
  return number % 2 === 0;
}
`;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze this code and generate professional documentation for it. Return ONLY a valid JSON (no markdown formatting, no extra text) in this exact structure:
{
  "summary": "one paragraph explaining what this code does",
  "functions": [
    {
      "name": "function name",
      "purpose": "what it does",
      "parameters": "what parameters it takes"
    }
  ],
  "readme": "a short markdown-style README content explaining setup and usage"
}

Code to document:
${sampleCode}`;
    
    const result = await model.generateContent(prompt);
    let docs = result.response.text();
    
    docs = docs.replace(/```json/g, '').replace(/```/g, '').trim();
    const docsData = JSON.parse(docs);
    
    res.json(docsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Documentation generate nahi ho payi' });
  }
});
app.get('/api/test-resume', async (req, res) => {
  try {
    const sampleCode = `
function calculateTotal(price, tax) {
  return price + (price * tax);
}

function greetUser(name) {
  return "Hello, " + name + "! Welcome to our app.";
}

function isEven(number) {
  return number % 2 === 0;
}
`;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze this code and generate professional resume bullet points that a developer could add to their resume to describe this project/code. Return ONLY a valid JSON (no markdown formatting, no extra text) in this exact structure:
{
  "bullets": [
    "bullet point 1 describing what was built and its impact",
    "bullet point 2",
    "bullet point 3"
  ],
  "suggestedSkills": ["skill1", "skill2", "skill3"]
}

Code to analyze:
${sampleCode}`;
    
    const result = await model.generateContent(prompt);
    let resume = result.response.text();
    
    resume = resume.replace(/```json/g, '').replace(/```/g, '').trim();
    const resumeData = JSON.parse(resume);
    
    res.json(resumeData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Resume bullets generate nahi hue' });
  }
});
app.get('/api/analyze-repo', authMiddleware, async (req, res) => {
  try {
    const { downloadUrl, socketId } = req.query;
    
    const emitUpdate = (message) => {
      if (socketId) {
        io.to(socketId).emit('progress', message);
      }
    };
    
    emitUpdate('Fetching code from GitHub...');
    const fileResponse = await axios.get(downloadUrl);
    const codeContent = fileResponse.data;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const reviewPrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "issues": [
    { "type": "bug", "description": "...", "severity": "high", "suggestion": "..." }
  ],
  "overallScore": 7
}
Code: ${codeContent}`;
    
    const docsPrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "summary": "...",
  "functions": [{ "name": "...", "purpose": "...", "parameters": "..." }],
  "readme": "..."
}
Code: ${codeContent}`;
    
    const resumePrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "bullets": ["...", "...", "..."],
  "suggestedSkills": ["...", "...", "..."]
}
Code: ${codeContent}`;

    const fixPrompt = `Analyze this code, fix all bugs, security issues, and bad practices. Return ONLY a valid JSON (no markdown, no extra text):
{
  "fixedCode": "the complete corrected code as a string, with proper error handling, security fixes, and best practices applied",
  "changesExplanation": "a short summary of what was changed and why"
}
Code: ${codeContent}`;
    
    emitUpdate('🔍 Agent 1: Reviewing code quality...');
    emitUpdate('📝 Agent 2: Generating documentation...');
    emitUpdate('💼 Agent 3: Creating resume bullets...');
    emitUpdate('🔧 Agent 4: Auto-fixing code...');
    
    const [reviewResult, docsResult, resumeResult, fixResult] = await Promise.all([
      model.generateContent(reviewPrompt),
      model.generateContent(docsPrompt),
      model.generateContent(resumePrompt),
      model.generateContent(fixPrompt)
    ]);
    
    emitUpdate('✅ Finalizing results...');
    
    const cleanJSON = (text) => {
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    };
    
    const reviewData = cleanJSON(reviewResult.response.text());
    const docsData = cleanJSON(docsResult.response.text());
    const resumeData = cleanJSON(resumeResult.response.text());
    const fixData = cleanJSON(fixResult.response.text());
    
    const newAnalysis = new AnalysisHistory({
      userId: req.userId,
      repoName: downloadUrl,
      fileName: downloadUrl.split('/').pop(),
      codeReview: reviewData,
      documentation: docsData,
      resumeBullets: resumeData,
      autoFix: fixData
    });
    
    await newAnalysis.save();
    
    emitUpdate('🎉 Analysis complete!');
    
    res.json({
      codeReview: reviewData,
      documentation: docsData,
      resumeBullets: resumeData,
      autoFix: fixData
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Analysis nahi ho paya' });
  }
});

   
    

app.get('/api/test-analyze', async (req, res) => {
  try {
    const codeContent = `
function calculateTotal(price, tax) {
  return price + (price * tax);
}

function getUser(req, res) {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, result) => {
    res.json(result);
  });
}
`;
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const reviewPrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "issues": [
    { "type": "bug", "description": "...", "severity": "high", "suggestion": "..." }
  ],
  "overallScore": 7
}
Code: ${codeContent}`;
    
    const docsPrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "summary": "...",
  "functions": [{ "name": "...", "purpose": "...", "parameters": "..." }],
  "readme": "..."
}
Code: ${codeContent}`;
    
    const resumePrompt = `Analyze this code and return ONLY a valid JSON (no markdown, no extra text):
{
  "bullets": ["...", "...", "..."],
  "suggestedSkills": ["...", "...", "..."]
}
Code: ${codeContent}`;
    
    const [reviewResult, docsResult, resumeResult] = await Promise.all([
      model.generateContent(reviewPrompt),
      model.generateContent(docsPrompt),
      model.generateContent(resumePrompt)
    ]);
    
    const cleanJSON = (text) => {
      return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    };
    
    const reviewData = cleanJSON(reviewResult.response.text());
    const docsData = cleanJSON(docsResult.response.text());
    const resumeData = cleanJSON(resumeResult.response.text());
    
    res.json({
      codeReview: reviewData,
      documentation: docsData,
      resumeBullets: resumeData
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Analysis nahi ho paya' });
  }
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya!'))
  .catch((err) => console.log('MongoDB connection error:', err));
app.post('/api/signup', async (req,res)=>{
  try {
    const { name , email , password } = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({error: 'ye email pehle se registered hi'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({message: 'Signup successful!'})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Signup fail ho gaya' });
  }
  });
  app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Step 1: User ko email se dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email ya password galat hai' });
    }
    
    // Step 2: Password match karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email ya password galat hai' });
    }
    
    // Step 3: Token banao
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ message: 'Login successful!', token, name: user.name });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Login fail ho gaya' });
  }
});
app.get('/api/history', authMiddleware, async (req, res) => {
  try {
    const history = await AnalysisHistory.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'History fetch nahi ho payi' });
  }
});
 // UPDATE - Profile update karo
app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, bio },
      { new: true }
    );
    res.json({ message: 'Profile updated!', name: updatedUser.name, bio: updatedUser.bio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Update fail ho gaya' });
  }
});

// READ - Apni profile info lo
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Profile fetch nahi ho payi' });
  }
});

// DELETE - History se ek entry delete karo
app.delete('/api/history/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await AnalysisHistory.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Delete fail ho gaya' });
  }
});
app.put('/api/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password galat hai' });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Password change fail ho gaya' });
  }
});
server.listen(PORT, ()=>{ console.log(`server chal raha hai port ${PORT} pe`);
});