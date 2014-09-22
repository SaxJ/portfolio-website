---
layout: post
title: "Game of Life"
date: 2014-03-30 12:18
categories: javascript
---

As I've had time, I've been rounding up projects I've done to post up. The first project I'm going to post is __The Game of Life__ written in JavaScript.

The Game of Life is a cellular automaton devised by John Horton Conway in 1970. I remember seeing a demo of this on a grid of lights when I was young, and I thought it was just really interesting to watch. When HTML 5 canvas stuff was new to me, I decided programming my own Game of Life using javascript would be a fun project for learning. I published this as an app on the [Pokki Store](http://www.pokki.com) hoping that maybe somebody else would be just as interested watching it as I was.

I whipped this up in a weekend, so it's not very hard. The game uses two boolean matrices, and on each 'tick', the active matrix is processed using the rules, and the results are placed in the second matrix. The second matrix is then the active matrix, and this repeats for each game tick. It's pretty simple.

The game is displayed by going through the active grid matrix, and drawing a square at a true cell. The co-ordinates are just multiples of the matrix index.

I'm looking at fixing some pretty major usability problems with this and re-publishing it on the Pokki store. One of the biggest problems is the fact that you have to click each square you want to activate. This is annoying, and you should be able to just click & drag to draw shapes on the game.