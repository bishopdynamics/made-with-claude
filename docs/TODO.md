# TODO List

This is the user-maintained TODO list; the only change the agent makes here is marking something done when it is. The user takes care of pruning completed items.

Items the agent deliberately deferred during implementation go to `docs/DEFERRED.md` instead; pull one in here when it's time to actually do it.

## Small Things

Little tweaks that do not warrant the full feature spec lifecycle.
If something here is actually bigger than it looks and really should be spec'd first, call that out and it goes through the full feature spec lifecycle (see Features below).

-

## Features

A feature must first be planned (user idea → research and discuss → improved idea → full feature spec), producing a spec file `docs/spec/FEATURE_SPEC_<thing>.md`. Then it can be implemented, following the spec.

- site visit counter
  - goatcounter account is set up
  - they gave me: `<script data-goatcounter="https://bishopdynamics.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`

- fix github repo name
  - it is currently "made-with-claude" but it should be "what-claude-made"
  - need to fix the remote here too
  - how will this affect the pipeline?
  - will this impact the certificate?