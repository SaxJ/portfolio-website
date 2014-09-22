/**
* @author Saxon Jensen
*/

function Vector2D(dx, dy, unit) {
    this.dx = dx;
    this.dy = dy;

    if (unit) {
        var mag = Math.sqrt(dx * dx + dy * dy);
        this.dx = dx / mag;
        this.dy = dy / mag;
    }
}