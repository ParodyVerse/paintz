'use strict';

/**
 * Create a new LineTool instance.
 * @param {CanvasRenderingContext2D} cxt - The canvas context in which the image is shown
 * @param {CanvasRenderingContext2D} preCxt - The canvas context in which the shape preview is drawn
 */
function LineTool(cxt, preCxt) {
	DrawingTool.apply(this, arguments);
}
// Extends DrawingTool.
LineTool.prototype = Object.create(DrawingTool.prototype);
LineTool.prototype.constructor = LineTool;

/**
 * Draw a line
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {CanvasRenderingContext2D} cxt
 */
LineTool.drawLine = function (x1, y1, x2, y2, cxt) {
	cxt.lineWidth = this.lineWidth;
	cxt.strokeStyle = this.lineColor;
	cxt.beginPath();
	cxt.moveTo(x1, y1);
	cxt.lineTo(x2, y2);
	cxt.stroke();
	cxt.closePath();
}

/**
 * @override
 * Handle the line tool becoming the active tool.
 */
LineTool.prototype.activate = function () {
	DrawingTool.prototype.activate.apply(this);
	
	toolbar.toolboxes.drawToolOptions.loadPromise.then(function () {
		toolbar.toolboxes.drawToolOptions.enableOutlineOnly();
	});
};

/**
 * @override
 * Handle a line being started by a pointer.
 * @param {Object} pointerState - The pointer coordinates and button
 */
LineTool.prototype.start = function (pointerState) {
	DrawingTool.prototype.start.apply(this, arguments);
	
	if (!settings.get('antiAlias')) {
		this._roundPointerState(pointerState);
	}
	
	this.startX = pointerState.x;
	this.startY = pointerState.y;
};

/**
 * @override
 * Update the line when the pointer is moved.
 * @param {Object} pointerState - The pointer coordinates
 */
LineTool.prototype.move = function (pointerState) {
	DrawingTool.prototype.move.apply(this, arguments);
	
	if (!settings.get('antiAlias')) {
		this._roundPointerState(pointerState);
	}
	
	// Erase the previous preview.
	Utils.clearCanvas(this._preCxt);
	
	// Draw the new preview.
	LineTool.drawLine(this.startX, this.startY, pointerState.x, pointerState.y, this._preCxt);
	
	if (!settings.get('antiAlias')) {
		this._deAntiAlias(Utils.colorToRGB(this._lineColor));
	}
};
