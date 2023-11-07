# job-matcher

## Description
The job matcher is a tool that matches a job to a candidate based on the location and role described in the candidates bio.

## Algorithm
The job matcher algorithm does the following:
1. Reads the data from the data folder
2. Parses the data into a list of jobs and a list of candidates
3. For each candidate, finds recommended jobs
   1. Parses candidates bio to extract tokens based on most frequently used RegExp sorted by most descriptive to least descriptive
   2. The tokens are used to score each job. The scoring system goes as follows.
      1. If the job location equals a whole token, the score is increased by 4
      2. If a part of the job location is part of any token, the score is increased by 3
      3. If the job title equals a whole token, the score is increased by 2
      4. If a part of the job title is part of any token, the score is increased by 1
4. Console logs the pairs of candidate and recommended jobs, the jobs are sorted by score excluding those with score === 0

## Limitations
1. The algorithm uses predifined RegExp to extract tokens from the candidates bio. This means that the algorithm is limited to the tokens defined in the RegExp.
2. The algorithm does not categorise the tokens for more sofisticated recommendations. For example, the algorithm does not distinguish between a token that describes a location and a token that describes a role, or it doesn't identify tokens to avoid.
3. The algorithm cannot associate similar concepts. For example, the algorithm cannot associate the token "software engineer" with the token "developer" or "design" and "designer"

## Installation
```
   npm install
```

## Usage
In order to build and run the job matcher against the data provided in the data folder, run the following command:

```
   npm run start
```