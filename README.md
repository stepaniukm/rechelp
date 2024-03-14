# rechelp

Recruitment Helper made in TypeScript, for a 100commitow.pl contest. The idea of the app is to help the recruiter manage many candidates and their tasks.
The idea was born when I myself struggled with filtering candidates and managing the tasks for each candidate.

[Current event storming result](https://link.excalidraw.com/readonly/KAcABOalBR9Ed2CimIhb)

Recruitment process ---has_many---> Recruitment step ---has_one---> Step flow ---has_many---> Question
Example: Node.js Developer Recruitment
Steps:

1. Initial call
2. Tech homework
3. Technical talk
4. Feedback
   Flows:
   1a. Questions -> random from a given deck
   2a. Task -> Either done on our page or on a public repo connected to our system and after that validated.
   3a. Warm-up questions -> random from a given deck
   3b. Easy/medium questions -> random from a given deck
   3c. Hard question -> random from a given deck
   3d. Live codding -> either on our page or in person's environment cloned from our template.
   4d. Feedback report -> Based on notes.
   Features:

- possibility to leave easily notes on every step of the process and assocciate it with feelings of the recruiter.
- automated feedback for a recruiter via AI, based on recruitment notes, i:n form of a brief summary
- comparison of candidates
