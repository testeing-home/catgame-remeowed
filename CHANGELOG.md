# Changelog
Here you will find what changed through versions.

Updated module:

* R = Remeowed
* S = Server

Stages of development:

* A = Alpha
* B = Beta
* R = Release
* S = Snapshot

UI/Data (Frontend = UI, Backend = Data)

Note: this is simplified.

* ! = Backend update
* \+ = Frontend update
* \$ = Both frontend and backend update

Release numbers:

* 1.0.x = Minor (for small patches, emergency fixes, etc.)
* 1.x.0 = Major (for bigger things, new mechanics, etc.)
* x.0.0 = Release (for very big updates, overhauls, etc.)

## RA$-1.0.0
First release of the versioning scheme!
This version had quite a lot of changes.

### Additions
+ Versioning scheme
+ Cats per tick calculation now accurate to the original game
+ Autosaves
+ Auto loading when you open the game
+ Dk/Dv checks in the server loading (don't worry if you don't know what this means)
+ Last key used

### Changes
* Reset key button now also resets the new last key used
* Buy success isn't really used much now. It has a default value of ``() => { }``
* Set last key used on the server loading

### Removals
- Buy success function of Cat Summoner upgrade
- JSON Error handler (because it wouldn't show me where the exception occured)

## RA$-1.0.1
Quick fix for saving/loading upgrades

### Additions
- Cat limit prototype

### Changes
- Load upgrade levels

## RA$-1.1.0
Cat Limits are added!

### Additions
- Reset your cats and upgrades to increase the cat limit and unlock new things that aren't added yet

### Changes
- Buttons now have a margin around them of 10 pixels
- Datastore section now looks nicer
