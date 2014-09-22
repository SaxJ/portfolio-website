/**
 *Contains javascript used to begin loading of resources.
 */

var Preloader = {
    preload: new createjs.LoadQueue(true),
    
    manifest: [
	{src: "images/battery.png", id: "battery"},
        {src: "images/bullet.png", id: "bullet"},
        {src: "images/bullet_powerup.png", id: "bullet_powerup"},
        {src: "images/chain_enemy.png", id: "chain_enemy"},
        {src: "images/drone.png", id: "drone"},
        {src: "images/effect-horizontal.png", id: "effect-horizontal"},
        {src: "images/explosion.png", id: "explosion"},
        {src: "images/gear.png", id: "gear"},
        {src: "images/generic_powerup.png", id: "generic_powerup"},
        {src: "images/grid.png", id: "grid"},
        {src: "images/health_cross.png", id: "health_cross"},
        {src: "images/player.png", id: "player"},
        {src: "images/richochet_drone.png", id: "richochet_drone"},
        {src: "images/skirter.png", id: "skirter"},
        {src: "images/title.png", id: "title"}
    ],
    
    startLoad: function() {
        Preloader.preload.loadManifest(Preloader.manifest, true);
    },
    
    getItem: function(id) {
        console.log("Getting id: " + id);
        var data = Preloader.preload.getResult(id);
        console.log(data);
        return data.result;
    },
    
    setProgressListener: function(funct) {
        Preloader.preload.onProgress = funct;
    },
    
    setCompleteListener: function(funct) {
        Preloader.preload.onComplete = funct;
    }
};