# Initial Idea

Project name: `hephaestion`

a simple but beautiful portfolio/blog website, hosted in github, which showcases all the projects I have built with claude. It will be callled `madewithclaude.com` and I already have the URL. This is intended to be a nice, polished portfolio/showcase kind of site, so it needs to put best foot forward in terms of beautiful simplicity in visual design.

when I say "all the projects" i really mean that we will add projects to this site one at a time, together, as each one will require some cleanup, capturing screenshots, and writing a blog entry

Here are the projecst that are ready to be posted:

- Half-Life: Continuum edition
- Vintage
- matrix-screensaver
- capture-view

Here are the projects that are almost-ready to be posted:

- BeamVM
- VintageVault

All of my projects are software related, mostly geared toward Linux and macOS

I would like this to be hosted entirely thru github. I see other sites that have some kind of setup, where changes are commited and pushed, an then some CI stage takes care of deploying it somewhere.
I would then set my domain (thru amazon Route53) to point to wherever that page ends up hosted.
The goal is to avoid hosting my own infrastructure for something that will be publicly accessed.

However, we _need_ a way to rapidly iterate on this website locally, without pushing anything, so that pushing is our final "publish" stage.
We will also need pre-commit hooks that will check for any secrets, sensitive files, personal information, to try to catch any/all of that before even committing.


Projects need images to best show them off, and most of my projects lack screenshots, etc.
We will come up with a paragraph for me to copy/paste to the maintainer LLMs of each of those projects, to kick off discussion of the specifics of capturing great screenshots for a particular project.

I don't know much about the implementation details for creating this kind of thing, so please take my naive description as guidance rather than set-in-stone, and guide me toward "the right way" to get what I want out of this.

