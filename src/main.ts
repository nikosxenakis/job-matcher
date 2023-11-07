import fs from 'fs';

const extractBioTokens = (bio: string) => {
   // TODO: More sofisticated token categorization is needed to improve the score, e.g. exlude tokens
   const regex1 = /I'm an? ([\w\s]+) in ([\w\s]+) relocate to ([\w\s]+)/;
   const regex2 = /I'm an? (\w+) from ([\w\s]+)/;
   const regex3 = /I'm looking for an? (job)? (in)? ([\w\s]+) outside of ([\w\s]+)/;
   const regex4 = /I'm looking for an? (\w+) in (\w+)/;
   const regex5 = /I'm looking for an? ([\w\s]+)/;

   const combinedRegex = new RegExp(`(${regex1.source}|${regex2.source}|${regex3.source}|${regex4.source}|${regex5.source})`);

   const match = combinedRegex.exec(bio);

   if (match) {
      // console.log("bio:", bio);
      // console.log("match:", match.slice(2, match.length).filter(x => x));
      return match.slice(2, match.length).filter(x => x);
   }

   return [];
}

const calculateScore = (tokens: string[], jobLocation: string, jobTitle: string) => {
   // Normalizing data
   const tokensNorm = tokens.filter(x => x).map(token => token.toLowerCase().trim());
   const jobLocationNorm = jobLocation.toLowerCase().trim();
   const jobTitleNorm = jobTitle.toLowerCase().trim();
   let score = 0;

   // Location score (4 points for exact match)
   if (tokensNorm.some(token => token === jobLocationNorm)) {
      score += 4;
   }
   // Location score (3 points for match)
   else if (
      jobLocationNorm.split(' ')
         .some(jobLocationPart => tokensNorm.some(token => token.includes(jobLocationPart)))) {
      score += 3;
   }

   // Job title score (2 points for exact match)
   if (tokensNorm.includes(jobTitleNorm)) {
      score += 2;
   }
   // Job title score (1 point for match)
   else if (
      jobTitleNorm.split(' ')
         .some(jobTitlePart => tokensNorm.some(token => token.includes(jobTitlePart)))) {
      score += 1;
   }

   return score;
}

const main = () => {
   // Parsing input files
   const members: Member[] = JSON.parse(fs.readFileSync('./data/members.json').toString());
   const jobs: Job[] = JSON.parse(fs.readFileSync('./data/jobs.json').toString());

   // TODO: Data validation, using libs like yup or joi

   for (const member of members) {
      const recommendedJobScores: Recommendation[] = [];

      // Extract member tokens
      const tokens = extractBioTokens(member.bio);
      for (const job of jobs) {
         const score = calculateScore(tokens, job.location, job.title);
         // Push only recommended jobs
         if (score > 0) {
            recommendedJobScores.push({ job, score });
         }
      }

      const uniqueRecommendedJobScores = recommendedJobScores.reduce((accumulator: Recommendation[], item) => {
         if (!accumulator.some(p =>
            p.job.title === item.job.title && p.job.location === item.job.location
         )) {
            accumulator.push(item);
         }
         return accumulator;
      }, []);

      console.log(member.name, uniqueRecommendedJobScores
         .filter((jobScore) => jobScore.score > 0)
         .sort((a, b) => b.score - a.score)
         .map(r => r.job));
   }
}

main();
