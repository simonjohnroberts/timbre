var WaveViewer = (function() {
    var WaveViewer = function() {
        initialize.apply(this, arguments);
    }, $this = WaveViewer.prototype;
    
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (f) {
            setTimeout(f, 1000/60)
        };
    
    var initialize = function(target, fps, canvas, width, height) {
        if (typeof canvas === "string") {
            canvas = document.getElementById(canvas);
        }
        this.target = target;
        this.fps    = fps;
        this.wave = null;
        this.isUpdated = false;
        this.isPlaying = false;
        this.context = canvas.getContext("2d");
        this.width  = canvas.width  = width;
        this.height = canvas.height = height;
        this.context.fillStyle   = "rgba(255, 255, 255, 0.4)";
        this.context.strokeStyle = "rgba(  0, 128, 255, 0.8)";
        this.context.lineWidth = 2;
    };
    
    $this.start = function() {
        var self = this;
        var target, fps, context, width, height, half_h;
        var prev, stop_delay = 10;
        
        target  = this.target;
        fps     = this.fps;
        context = this.context;
        width   = this.width;
        height  = this.height;
        half_h  = height >> 1;
        prev = 0;
        
        var animate = function() {
            var now, wave, dx, i, imax;
            now = +new Date();
            if (now - prev >= fps) {
                prev = now;
                
                context.fillRect(0, 0, width, height);

                if (self.isPlaying) {
                    wave = target._cell;
                    dx   = width / wave.length;
                    context.beginPath();
                    context.moveTo(0, half_h - (half_h * wave[0]));
                    for (i = 1, imax = wave.length; i < imax; ++i) {
                        context.lineTo(i*dx, half_h - (half_h * wave[i]));
                    }
                    context.stroke();
                } else {
                    fps = 10;
                    --stop_delay;
                }
            }
            if (stop_delay > 0) {
                requestAnimationFrame(animate);
            }
        };
        
        this.isPlaying = true;
        requestAnimationFrame(animate);
    };
    
    $this.pause = function() {
        this.isPlaying = false;
    };
    
    return WaveViewer;
}());