# PMMG Extended

PMMG Beautifier Extended adds features to the game that modify the UI, improving the play experience.

Thank you to yarekt for developing the base features of PMMGBeautifier that this extension is based on.

In addition, thank you to our other contributors:

* Saganaki and Kovus - Server listening scripts (gathered from FIO)
* SeraphX2 - XIT CONTRACTS
* Rynx - PrUN UI Enhancer
* AGM-114 - Pending Contracts and Compact UI
* allocater - Icons Style
* Booers - Links in XIT NOTES

Features and examples are listed on PMMG's website: https://sites.google.com/view/pmmgextended/features?authuser=0

# Installation

For Chromium install (Chrome, Edge,
etc) - https://chrome.google.com/webstore/detail/pmmg-extended/cadmmgnpgphgndeeoldoohkcbjkohigg

For FireFox install - https://addons.mozilla.org/en-US/firefox/addon/pmmg-extended/

For building from source - See below

## Building from Source

Requirements: `nodejs`, `npm` (or `yarn` works too)

Webpack is used to create javascript from typescript, and puts everything into
`dist/` dir.
You can load that directly using "load unpacked" extension pointing to `dist`.
Keep the build command running to make it rebuild as you edit typescript files.

```bash
npm install
npm run build
```

### Firefox Development

* Unzip the `dist` zip file
* Rename manifest.json to manifest_v3.json
* Rename manifest_v2.json to manifest.json
* Open `about:debugging` in Firefox
* Select `Load Temporary Add-on` and select the `manifest.json` from this repo

# Development

There are two types of features in PMMG Extended, Modules and XIT buffers.
Modules are features that are run every 0.25 seconds and modify an existing part of the UI. They are all found under
the `src` folder and are handled by ModuleRunner.
XIT Buffers are features that construct a custom buffer using the XIT command. They are all found under the `src\XIT`
folder and are handled by XITHandler.

Data is stored in local storage with the following keys:

* PMMGExtended - General settings
* PMMG-User-Info - Information collected from the web socket
* PMMG-Finances - Financial Information
* PMMG-Notes - Notes
* PMMG-Checklists - Checklists
* PMMG-Lists - Command Lists

The PMMGExtended and PMMG-User-Info data is passed around through an object and should not be read anew by a module.

PMMG Extended works generally like this:

The main script runs, performing one-time start up actions like adding CSS styles, triggering financial recording, and
getting settings.
The main script will also initiate the Module Runner and a loop to update info collected from the web socket
A list of all the modules is present in the main function. This is where you should add any new ones.

The module runner loops through each module calling it's `run(allBuffers)` function, taking in a list of all of the
buffers which can be easily parsed using the `getBuffersFromList` function in util.
The module runner also calls XITHandler allowing XIT buffers to be created

Inside of XITHandler a list of all of the XIT buffers is in `xit-commands.tsx`. Any new buffers should be added here.

## General Tips

Avoid excessive resource use. If it only needs to be done once it should only be done once and not every 0.25 seconds.
Tagging the elements you have scanned or modified with a class is a good way to signify this.

Do not delete any elements on the interface. PrUn can crash if it finds an element is no longer there. Instead, set
their CSS property `display: none`.

Many commonly used functions already exist in `util.js`. Check there for something you see other modules doing or add
something if you think it would be useful for other modules.

PMMG Extended cannot automate gameplay which means it cannot send write requests to the server. Something like modifying
the size of a tile on a screen will be saved to the server and so is illegal.

If you have more specific questions, ping `@PiBoy314` in the PCT discord channel.
