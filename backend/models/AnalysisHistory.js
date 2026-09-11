const mongoose = require('mongoose');
const analysisHistorySchema = new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repoName: {
        type: String,
        required:true
    },
    fileName: {
        type: String,
        required: true
    },
    codeReview: {
        type: Object
    },
    documentation: {
        type: Object
    },
    resumeBullets: {
    type: Object
  },
  autoFix: {
    type: Object
  }
}, { timestamps: true });

const AnalysisHistory = mongoose.model('AnalysisHistory', analysisHistorySchema);
module.exports = AnalysisHistory;