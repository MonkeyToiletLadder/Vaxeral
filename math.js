module.exports = {
    distance: function(lhs, rhs) {
        const dx = lhs.pos.x - rhs.pos.x;
        const dy = lhs.pos.y - rhs.pos.y;
        return Math.hypot(dx, dy);
    },
    distance_squared: function(lhs, rhs) {
        const dx = lhs.pos.x - rhs.pos.x;
        const dy = lhs.pos.y - rhs.pos.y;
        return dx * dx + dy * dy;
    }
}
