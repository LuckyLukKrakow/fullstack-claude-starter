---
name: check-project
description: Run reproducible frontend, backend and hook verification for this repository and explain failures or missing prerequisites.
---
From the repository root, run npm run check:frontend, npm run build:frontend,
npm run test:backend, npm run test:hooks and npm run check:config. When tools or dependencies are missing,
report the prerequisite rather than claiming success. After fixing a failure rerun its
affected check. Distinguish actual test results from static inspection.
