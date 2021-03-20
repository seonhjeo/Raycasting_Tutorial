#ifndef GRAPHICS_H
#define GRAPHICS_H

#include <stdbool.h>
#include <SDL.h>
#include <stdio.h>
#include "defs.h"

bool initializeWindow(void);
void destroyWindow(void);
void clearColorBuffer(color_t color);
void renderColorBuffer(void);
void drawPixel(int x, int y, color_t color);
void drawRect(int x, int y, int width, int height, color_t color);
void drawLine(int x0, int y0, int x1, int y1, color_t color);

#endif
