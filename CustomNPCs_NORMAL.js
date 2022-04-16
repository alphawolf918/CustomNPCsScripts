function chat(event) {
    var player = event.player;
    var world = player.world;
    var message = event.message.toLowerCase();
    if (message == "heal") {
        player.setHealth(player.getMaxHealth());
        serverSay(world, player.getName() + " has been healed!");
    } else if (message == "let there be light") {
        serverSay(world, "AND SO THERE WAS LIGHT!");
        world.setTime(0);
    } else if (message == "moo") {
        serverSay(world, "quack");
    } else if (message.substr(0, 5) == "math:"){
		var msg = message.replace("math:", "");
		serverSay(world, msg + " = " + eval(msg));
		event.setCanceled(true);
	} else if (message.substr(0, 1) == ">"){
		event.setCanceled(true);
		var s = message.replace(">", "");
		s = message.split(" ");
		processCommand(world, s);
	} else if(message == "coords"){
		event.setCanceled(true);
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ();
		var coords = "Current Coordinates: " + parseInt(x) + " " + parseInt(y) + " " + parseInt(z);
		player.message(coords);
	} else if(message.substr(0, 10) == "serversay:"){
		var msg = message.replace("serversay:", "");
		serverSay(world, msg);
		event.setCanceled(true);
	}
}

function processCommand(world, args){
	var cmd = args[0];
	var subCmd = args[1];
	var s = cmd + " " + subCmd;
	serverSay(world, s);
}

function died(event) {
	var deathQuotes = new Array("LOL they ded tho", "Well that didn't take long", "Maybe it's time for a career change", "It's time to stop", "Have you tried turning it off and on again? Well you have now", "Okay but why though", "Doesn't seem like that worked out too well");
	var rand = Math.random();
	var qInd = Math.floor(rand * deathQuotes.length);
	var quote = deathQuotes[qInd] + ".";
    serverSay(event.player.world, quote);
}

function broken(event) {
    var block = event.block;
    var name = block.getName();
    var meta = block.getMetadata();
	meta = (meta == "" || meta == null) ? 0 : meta;
	meta = (meta == 12) ? 0 : meta;
    var world = block.getWorld();
    var player = event.player;
    var mainHandItem = player.getMainhandItem();
    var itemName = "";
	var otherItemName = "";
    if (mainHandItem != null) {
        itemName = mainHandItem.getItemName();
    }
	if(otherItemName != null){
		otherItemName = player.getOffhandItem().getItemName();
	}
    if (name == "variedcommodities:placeholder" && itemName != "Arrow" && otherItemName != "Arrow") {
        event.setCanceled(true);
    } else {
        if (name == "variedcommodities:placeholder" && itemName == "Arrow") {
            var is = world.createItem(name, meta, 1);
            player.giveItem(is);
        }
    }
    if(name == "minecraft:log" || name == "minecraft:log2"){
        if(itemName.match(/\sAxe/)){
            var x = block.getX();
            var y = block.getY();
            var z = block.getZ();
            breakTree(world, x, y, z, player, name, meta);
        }
    }
	if(name == "minecraft:obsidian"){
		if(itemName.match(/\sPickaxe/)){
			var x = block.getX();
			var y = block.getY();
			var z = block.getZ();
			breakObsidianVein(world, x, y, z, player, name);
		}
	}
}

function breakObsidianVein(world, x, y, z, player, name){
	if(isObsidianBlock(world, x, (y + 1), z)){
		setToAir(world, x, (y + 1), z);
		breakObsidianVein(world, x, (y + 1), z, player, name);
		giveObsidian(world, player);
	}
	if(isObsidianBlock(world, x, (y - 1), z)){
		setToAir(world, x, (y - 1), z);
		breakObsidianVein(world, x, (y - 1), z, player, name);
		giveObsidian(world, player);
	}
	if(isObsidianBlock(world, (x + 1), y, z)){
		setToAir(world, (x + 1), y, z);
		breakObsidianVein(world, (x + 1), y, z, player, name);
		giveObsidian(world, player);
	}
	if(isObsidianBlock(world, (x - 1), y, z)){
		setToAir(world, (x - 1), y, z);
		breakObsidianVein(world, (x - 1), y, z, player, name);
		giveObsidian(world, player);
	}
	if(isObsidianBlock(world, x, y, (z + 1))){
		setToAir(world, x, y, (z + 1));
		breakObsidianVein(world, x, y, (z + 1), player, name);
		giveObsidian(world, player);
	}
	if(isObsidianBlock(world, x, y, (z - 1))){
		setToAir(world, x, y, (z - 1));
		breakObsidianVein(world, x, y, (z - 1), player, name)
		giveObsidian(world, player);
	}
}

function breakTree(world, x, y, z, player, name, meta){
    if(isTreeBlock(world, x, (y + 1), z)){
        setToAir(world, x, (y + 1), z);
        breakTree(world, x, (y + 1), z, player, name, meta);
		giveBlock(name, world, player, meta);
    }
    if(isTreeBlock(world, x, (y - 1), z)){
        setToAir(world, x, (y - 1), z);
        breakTree(world, x, (y - 1), z, player, name, meta);
		giveBlock(name, world, player, meta);
    }
    if(isTreeBlock(world, (x + 1), y, z)){
        setToAir(world, (x + 1), y, z);
        breakTree(world, (x + 1), y, z, player, name, meta);
		giveBlock(name, world, player, meta);
    }
    if(isTreeBlock(world, (x - 1), y, z)){
        setToAir(world, (x - 1), y, z);
        breakTree(world, (x - 1), y, z, player, name, meta);
		giveBlock(name, world, player, meta);
    }
    if(isTreeBlock(world, x, y, (z + 1))){
        setToAir(world, x, y, (z + 1));
        breakTree(world, x, y, (z + 1), player, name, meta);
		giveBlock(name, world, player, meta);
    }
    if(isTreeBlock(world, x, y, (z - 1))){
        setToAir(world, x, y, (z - 1));
        breakTree(world, x, y, (z - 1), player, name, meta);
		giveBlock(name, world, player, meta);
    }
}

function isObsidianBlock(world, x, y, z){
    if(world.getBlock(x, y, z) == null){
        return false;
    }
	
	var blockName = world.getBlock(x, y, z).getName();
	if(blockName == "minecraft:obsidian"){
		return true;
	}
	return false;
}

function giveBlock(name, world, player, meta){
	if(!name.match(/leaves/) && name.match(/log/)){
		var is = world.createItem(name, meta, 1);
		player.giveItem(is);
		if(name.match(/acacia/i)){
			meta = 4;
		}
		var sap = world.createItem("minecraft:sapling", meta, 1);
		var rng = Math.random() * 100;
		rng = Math.floor(rng+1);
		if(rng <= 10){
			player.giveItem(sap);
		}
		if(rng == 1){
			var xpLevel = player.getExpLevel();
			player.setExpLevel(xpLevel+1);
		}
	}
}

function giveObsidian(world, player){
	var is = world.createItem("minecraft:obsidian", 0, 1);
	if(player != null){
		player.giveItem(is);
	}
	
	var rng = Math.random() * 100;
	rng = Math.floor(rng+1);
	if(rng == 1){
		var xpLevel = player.getExpLevel();
		player.setExpLevel(xpLevel+1);
	}
}

function isTreeBlock(world, x, y, z){
    if(world.getBlock(x, y, z) == null){
        return false;
    }
	
	var block = world.getBlock(x, y, z).getName();
    if(block == "minecraft:log" || block == "minecraft:log2" || block == "minecraft:leaves" || block == "minecraft:leaves2"){
        return true;
    }
    return false;
}

function isLeafBlock(world, x, y, z){
	var block = world.getBlock(x, y, z);
	return (block == "minecraft:leaves" || block == "minecraft:leaves2")
}

function serverSay(world, strMessage) {
    world.broadcast("[Server] " + strMessage);
}

function setToAir(world, x, y, z){
    if(world.getBlock(x, y, z) != "air"){
        world.setBlock(x, y, z, "air", 0);
    }
}

function kill(event){
	var player = event.player;
	var xpLevel = player.getExpLevel();
	if((Math.random() * 200) <= 10){
		player.setExpLevel(xpLevel+1);
	}
}