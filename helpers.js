let math = require('math');

module.exports = {
    haul: function(hauler, resource) {
        let flag = Game.flags[hauler.memory.target];

        let dropped = flag.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (dropped) => { return math.distance_squared(dropped, flag) <= 2 && dropped.amount > 10; }});
        let is_pickedup = hauler.pickup(dropped);
        
        if(is_pickedup == ERR_NOT_IN_RANGE) {
            hauler.moveTo(dropped);
        } else if(is_pickedup == ERR_INVALID_TARGET) {
            let harvester = Game.creeps[flag.memory.harvester];
            if(_.isUndefined(harvester)) { 
                return;
            }
            if(!harvester.memory.in_position) {
                return;
            }

            let is_transfered = harvester.transfer(hauler, resource);
            if(is_transfered == ERR_NOT_IN_RANGE) {
                hauler.moveTo(harvester);
            }
        }
    }
}
