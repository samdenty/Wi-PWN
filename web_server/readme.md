## What is [Jekyll](https://jekyllrb.com/)?

Jekyll is a pre-compiler for static content generation, it's basically makes everything easier to maintain - but the outputted HTML is the same.

In order to do any development (or even run the webserver) you need to do the following:

- Install [Ruby, Gem package manager & Jekyll](https://davidburela.wordpress.com/2015/11/28/easily-install-jekyll-on-windows-with-3-command-prompt-entries-and-chocolatey/) (see [here for Linux](http://michaelchelen.net/81fa/install-jekyll-2-ubuntu-14-04/))
- Run `bundler install` in the `/web_server/html` folder

## How to run a local server of Wi-PWN
- Make sure you have Jekyll & Gems installed (see above)
- Run `jekyll serve` in the `/web_server/html` folder
- Navigate over to `http://127.0.0.1:1337` and see changes you make to the files happen in real-time (make sure to refresh the page though)


## How to update web-server files

### Auto Mode (Windows only)

- Make sure you have Jekyll & Gems installed (see above)
- Launch `auto_generate.exe`
- Wait for it to finish
- That's it **¯\_(ツ)_/¯**

![](http://imgur.com/i9t0yr6.png)