'use strict';

//For bots
const reservedNames = ["assasin23", "shinystar", "dragon76", "lunatic", 
"shadow45", "firefly", "hunter12", "crystal", "blade99", "sparky", "raven34", 
"angelic", "killer66", "fluffy", "ghost21", "sunny", "cobra88", "dreamy", "viper17", 
"rainbow", "reaper44", "starry", "tiger69", "cutie", "joker13", "snowy", "wolfy77", 
"bunny", "ninja25", "cloudy", "zombie11", "rosy", "spider16", "candy", "thief32", 
"cherry", "demon27", "happy", "sniper19", "lucky"]

var firebase = require('firebase')

const vrandom = require("vrandom")

var randomstring = require("randomstring")

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

var dbConectado = false

//FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDlbxJ1KBT0F09C_WJdVkRV8RlGlPmEcPg",
  authDomain: "blighted-havoc.firebaseapp.com",
  databaseURL: "https://blighted-havoc-default-rtdb.firebaseio.com",
  projectId: "blighted-havoc",
  storageBucket: "blighted-havoc.appspot.com",
  messagingSenderId: "504242136242",
  appId: "1:504242136242:web:4537ac0b80a062a5fa15ab",
  measurementId: "G-L6K6JYRDYK"
};

firebase.initializeApp(firebaseConfig)

let database = firebase.database()


//const { putVar, getVar } = require('@gd-com/utils')
const gdCom = require('@gd-com/utils')

// version: Para evitar que se jueguen versiones antigüas
const version = "0.00.01"

const countBotLimit = 5; // For adding bots to the game

const maps = {
    "lostEden": {}
}

// Create multiplayer maps
//Lost eden
for (let i = 1; i <= 5; i++) {
    maps["lostEden"]["lostEden" + String(i)] = {
            "status": "waiting",
            "healApplePos": "A",
            "hAChoose": "no",
            "acuWeaponLevel": 0, // For bots to make stats near to the human players
            "acuArmorLevel": 0,
            "acuHp":0,
            "humanQtn": 0,
            "botNameIndex":0,
            "countBots":0,
            "moveBotsTime":0,
            "Sockets":{},
            "Players":{
                "player1": "none",
                "player2": "none",
                "player3": "none",
                "player4": "none",
                "player5": "none",
                "player6": "none",
                "player7": "none",
                "player8": "none",
                "player9": "none",
                "player10": "none"
            }
        }
}



const AdventureMapsA = {
    "DOE1":{
        "Players":{},
        "Sockets":{},
        "Mobs":{
            "Ankhet01":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[2750,900],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Ankhet02":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[2750,1300],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Ankhet03":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[3400,800],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Ankhet04":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[3400,1500],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Ankhet05":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[4000,850],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Ankhet06":{"specie":"Ankhet","Hp":50,"RbTime":0,"alive":true,"iniPos":[4000,1300],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis01":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[950,2800],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis02":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[1400,2500],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis03":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[950,3300],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis04":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[1900,2800],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis05":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[1400,3500],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Apofis06":{"specie":"Apofis","Hp":70,"RbTime":0,"alive":true,"iniPos":[1800,3300],"posX":0,"posY":0, "enemy":"n","efs":{}},
            "Khonsu01":{"specie":"Khonsu","Hp":1000,"RbTime":0,"alive":true,"iniPos":[1100,4900],"posX":0,"posY":0, "enemy":"n","efs":{}}
        },
        "InvObjects":{
            "MR0":{"objType":"MR","RbTime":0,"shown":true},
            "MR1":{"objType":"MR","RbTime":0,"shown":true},
            "MR2":{"objType":"MR","RbTime":0,"shown":true},
            "MR3":{"objType":"MR","RbTime":0,"shown":true},
            "MR4":{"objType":"MR","RbTime":0,"shown":true},
            "MR5":{"objType":"MR","RbTime":0,"shown":true},
            "MR6":{"objType":"MR","RbTime":0,"shown":true},
            "MR7":{"objType":"MR","RbTime":0,"shown":true},
            "MR8":{"objType":"MR","RbTime":0,"shown":true},
            "MR9":{"objType":"MR","RbTime":0,"shown":true},
            "MR10":{"objType":"MR","RbTime":0,"shown":true}
        }
    }
}

const boxes = {
    "simpleWeaponBox":{
        "Item1":{"gro":"wea","cat":"Sw","t":"simpleSword","l":1,"g":"s", "se1":"n", "se2":"n", "se3":"n","Bp":75, "evoP": 15, "est":"n","bo":"n"},
        "Item2":{"gro":"wea","cat":"St","t":"simpleStaff","l":1,"g":"s", "se1":"n", "se2":"n", "se3":"n","Bp":75, "evoP": 15, "est":"n","bo":"n"},
        "Item3":{"gro":"wea","cat":"Ds","t":"simpleKillers","l":1,"g":"s", "se1":"n", "se2":"n", "se3":"n","Bp":75, "evoP": 15, "est":"n","bo":"n"},
        "Item4":{"gro":"wea","cat":"Gu","t":"simpleGun","l":1,"g":"s", "se1":"n", "se2":"n", "se3":"n","Bp":75, "evoP": 15, "est":"n","bo":"n"},
        "Item5":{"gro":"BoxSuc","na":"boxSuccess10","pri":1000,"canAdd":false,"bo":"n","qtn":1},
        "Item6":{"gro":"cOrbs","na":"compressSimpleEO1","pri":500,"canAdd":false,"bo":"n","qtn":1}
    }
};


const SKILLCOST = {
    "StrengthenedResolve":1000,
    "MightyStrike":1000,
    "AeroAvian":1000,
    "StoneShot":1000,
    "DarkBlaze":1000
}

function randomNumber(min, max) {
  return Math.floor (Math.random () * (max - min + 1)) + min;
}

wss.on('connection', async function connection(ws) {

    ws.on('close', function close() {     
        
        console.log("A user is disconnected");

        if (ws.hasOwnProperty('adventure')){
            if (ws.adventure){
                if (ws.map == "DOE1"){
                    delete AdventureMapsA[ws.map]["Players"][ws.username]
                    delete AdventureMapsA[ws.map]["Sockets"][ws.username]
                    //console.log(AdventureMapsA[ws.map]["Players"])
                    //console.log(AdventureMapsA[ws.map]["Sockets"])
                }
            } else {
                console.log("Saliendo del modo multijugador")
                maps[ws.map][ws.mapVariation]["Players"][ws.player] = "none";
                delete maps[ws.map][ws.mapVariation]["Sockets"][ws.username]
            }
        }

        //ws.acPotion = 0; // To know how many potions we used before sending to the DB
            //ws.totalPotions = rec.potions; // To know how many potions we had in the begin of the game and avoid hacking
        if (ws.hasOwnProperty("acPotion1")){
            if (!ws.acPotion1 < 1){
                let getPotionQtn = database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot1).child("qtn").once("value");
                getPotionQtn.then(snapshot => {
                getPotionQtn = snapshot.val();
                let potionsQtn = getPotionQtn - ws.acPotion1
                if (potionsQtn < 1){
                    database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot1).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"});
                    database.ref("users").child(ws.username).child("pot1").set("n")
                    return
                }            
                database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot1).child("qtn").set(potionsQtn);
                });
            }            
        }

        if (ws.hasOwnProperty("acPotion2")){
            if (!ws.acPotion2 < 1){
                let getPotionQtn = database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot2).child("qtn").once("value");
                getPotionQtn.then(snapshot => {
                getPotionQtn = snapshot.val();
                let potionsQtn = getPotionQtn - ws.acPotion2
                if (potionsQtn < 1){
                    database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot2).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"});
                    database.ref("users").child(ws.username).child("pot2").set("n")
                    return
                }            
                database.ref("users").child(ws.username).child("bags").child("itemBag").child(ws.pSlot2).child("qtn").set(potionsQtn);
                });
            }            
        }


    })

    ws.on('message', async function incoming(message) {
        let rec = new Buffer.from(message)
        let decoded = gdCom.getVar(rec)
        rec = JSON.parse(decoded.value)
        //console.log(rec)

        if (rec.men == 'cv'){ // cv = check version, we check if version is correct
            let data = {}
            data.men = "cv" // t is type
            data.v = version
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == 'tu'){ //tu: try user to avoid duplications
            let data = {}

            agregarUsuario(rec.username, rec.password, rec.email)
                .then((resultado) => {
                    //console.log(resultado);
                    if (resultado.mensaje == 'userExists'){
                        data.men = "userExists"
                    } else if (resultado.mensaje == 'regSuccess'){
                        data.men = "regSuccess" 
                    } else if (resultado.mensaje == 'dbError'){
                        data.men = "dbError" 
                    }
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });

        } else if (rec.men == 'tl'){ //try login
            let data = {}

            verificarUsuario(rec.username, rec.password)
                .then((resultado) => {
                    if (resultado.mensaje == 'noExists'){
                        data.men = "noExists"
                    } else if (resultado.mensaje == 'invalidPassword'){
                        data.men = "invalidPassword" 
                    } else if (resultado.mensaje == 'dbError'){
                        data.men = "dbError" 
                    } else if (resultado.mensaje == 'success'){
                        data.men = "success"
                    }
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });

        } else if (rec.men == 'getUserData'){
            let data = {};

            // Aquí debes realizar la consulta a la base de datos para obtener la información del usuario
            try {
                const snapshot = await database.ref("users").child(rec.username).once("value");
                data = snapshot.val();
            } catch (err) {
                // Si ocurre un error en la base de datos, devuelve un mensaje de error al cliente
                console.error('Error en la base de datos: ', err);
                data = { mensaje: 'dbError', error: 'Error en la base de datos' };
                return;
            }

            // Enviar la información del usuario al cliente a través del WebSocket
            data.men = "userDataGotten"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == 'getPrizes'){

            try {
                // Convertir la cantidad de oro de cadena a entero
                const goldToAdd = parseInt(rec.gold, 10);

                // Actualizar la cantidad de oro en la base de datos
                await database.ref("users").child(rec.username).child("gold").transaction((currentGold) => {
                    return (currentGold || 0) + goldToAdd;
                });

            } catch (err) {
                console.error('Error en la base de datos: ', err);
                return { mensaje: 'dbError', error: 'Error en la base de datos' };
            }

        } else if (rec.men == 'matching'){ //matching players
            ws.username = rec.username

            let data = {}

            data.men = "matchingResult"


            const matchingResult = await findAvailableSpace(ws.username, rec.map, parseInt(rec.maxhp), parseInt(rec.pDef), rec.weaponName, rec.weaponCat, rec.weaponLevel, rec.armorName, rec.armorGrade, rec.armorLevel)
            if (matchingResult.success){
                data.result = "success"
                data.mapVariation = matchingResult.variation
                data.player = matchingResult.player
                ws.mapName = matchingResult.map
                ws.mapVariation = matchingResult.variation
                ws.player = matchingResult.player
                //console.log(data)
                //console.log(maps[matchingResult.map][matchingResult.variation])
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)

            } else {
                data.result = "fail"
                console.log("Matching fail")
                console.log(matchingResult.message)
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }  


        } else if (rec.men == 'unmatch') { //delete player from map
            console.log("Making unmatch")
            if (!ws.mapName || !ws.mapVariation) {
                return;
              }


            const playerIndex = ws.player;
            const mapVariation = maps[ws.mapName][ws.mapVariation];
            if (mapVariation["Players"][playerIndex]) {
                // Si el jugador está en el mapa, cambia su valor a "none"
                mapVariation["Players"][playerIndex] = "none";
                //console.log("Removed player " + ws.username + " from map");
                //console.log(maps[ws.mapName][ws.mapVariation])
                let data = {}
                data.men = "unmatched"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }

        } else if (rec.men == 'unmatchGame') { //delete player from map in game
            console.log("Unmatching in game")
            const playerIndex = rec.player;
            const mapVariation = maps[rec.map][rec.variation];
            if (mapVariation["Players"][playerIndex]) {
                // Si el jugador está en el mapa, cambia su valor a "none"
                mapVariation["Players"][playerIndex] = "none";
                //console.log("Removed player " + ws.username + " from map in playing game");
                //console.log(maps[rec.map][rec.variation])
                let data = {}
                data.men = "unmatched"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }


        } else if (rec.men == 'getMapInfo') { //We send players number and others to client
            const playerCount = await checkIfPlayersAreFull(ws.mapName, ws.mapVariation)
            let data = {}
            data.men = "mapInfo"
            data.status = maps[ws.mapName][ws.mapVariation].status
            data.playerCount = playerCount
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


        } else if (rec.men == 'getCurrentGame') { //We send current map (match) info
            
            let mapData = maps[rec.Map][rec.mapVariation];
            let data = {
                map: {
                    status: mapData.status,
                    limitTime: mapData.limitTime,
                    ha: mapData.healApplePos
                },
                players: {}
            };

            //data.players = mapData.Players

            for (let player in mapData.Players){
                if (mapData.Players[player] != "none"){
                    data.players[player] = mapData.Players[player]
                }
            }

            data.men = "gameGotten"

            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

            return

        } else if (rec.men == 'updatePos') { //We send players number and others to client

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation]["Players"][rec.player] == "none"){
                return;
            }

            maps[rec.map][rec.variation]["Players"][rec.player].posx = rec.x
            maps[rec.map][rec.variation]["Players"][rec.player].posy = rec.y

        } else if (rec.men == 'attack') { //We attack enemies

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
                console.log("Variation not found");
                return;
            }

            if (maps[rec.map][rec.variation]["Players"][rec.enemy] == "none"){
                return;
            }

            //Send attack info for text damage animation, separate of gamegotten
            let data = {}
            data.men = "dmgAnim"
            data.enemy = rec.enemy
            data.dmgGot = rec.atk
            data.crit = rec.critical
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


            maps[rec.map][rec.variation]["Players"][rec.enemy].hp -= rec.atk


            if (rec.effect != "n"){
                if (rec.effect == "SDss"){ // StoneShot slow down 50% for 3 seconds
                    maps[rec.map][rec.variation]["Players"][rec.enemy]["efs"][rec.effect] = Date.now() + 3000
                }
            }


        } else if (rec.men == 'recDmg') { //We recieve damage from bots

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }
            if (maps[rec.map][rec.variation]["Players"][rec.me] != 'none'){
                maps[rec.map][rec.variation]["Players"][rec.me].hp -= rec.atk
            }

            //Send attack info for text damage animation, separate of gamegotten
            let data = {}
            data.men = "dmgAnimSelf"
            data.dmgGot = rec.atk
            data.crit = rec.critical
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)
            

        } else if (rec.men == 'botAttack') { //Bot attacks bot

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation]["Players"][rec.enemy] != "none"){
                maps[rec.map][rec.variation]["Players"][rec.enemy].hp -= rec.dmg
            }           
            
        } else if (rec.men == 'appleHealing') { //Apple heals 50 hp in Lost Eden or fraction, depends on maxhp

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
            console.log("Variation not found");
            return;
            }

            if (maps[rec.map][rec.variation]["Players"][rec.player] != "none"){
                maps[rec.map][rec.variation]["Players"][rec.player].hp += 50

                if (maps[rec.map][rec.variation]["Players"][rec.player].hp > maps[rec.map][rec.variation]["Players"][rec.player].maxhp){
                    maps[rec.map][rec.variation]["Players"][rec.player].hp = maps[rec.map][rec.variation]["Players"][rec.player].maxhp
                }
            }           
            
        } else if (rec.men == 'saveWS'){
            ws.username = rec.username
            ws.player = rec.player
            ws.adventure = false;
            ws.map = rec.map;
            ws.mapVariation = rec.variation;

            const map = maps[rec.map];
            if (!map) {
            console.log("Map not found");
            return;
            }
            const variationData = map[rec.variation];
            if (!variationData) {
                console.log("Variation not found");
                return;
            }

            maps[rec.map][rec.variation]["Sockets"][rec.username] = ws

            //maps[rec.map][rec.variation][rec.player]["ws"] = ws;
            //console.log("SE creo el ws:")
            //console.log(maps[rec.map][rec.variation][rec.player])

        } else if (rec.men == 'skillSent'){
            //console.log('Llego el ',rec.skillName)
            
            for (let player in maps[rec.map][rec.variation]["Sockets"]){

                    //console.log("Activando skill")
                    let data = {}
                    data.men = "skillActivated"
                    data.skillName = rec.skillName
                    data.player = rec.player
                    data.target = rec.target
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    maps[rec.map][rec.variation]["Sockets"][player].send(data)
                    //console.log(player.ws)
                
            }     

        } else if (rec.men == 'buySkill'){//Skill Shop----------------------------------------------------

            let processBuy = false

            let username = rec.user;
            let price = SKILLCOST[rec.skill]            

            let skillPrice = parseInt(price, 10); // Precio de la habilidad a comprar
            let data = {};
            data.men = "resBuySkill";

            let userGold = await database.ref("users").child(username).child("gold").once("value");
            userGold = userGold.val();

            if (price > userGold){
                data.buyStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            };

            // Verificar espacio disponible en actSkills
            let purSkills = await database.ref("users").child(username).child("character").child("purSkills").once("value");
            purSkills = purSkills.val();

            let purchasedSkillSlot = null;

            // Buscar un espacio vacío en purSkills
            for (let skillSlot in purSkills) {
                if (purSkills[skillSlot].t == "n") {
                    purchasedSkillSlot = skillSlot;
                    break;
                }
            }

            if (purchasedSkillSlot) {
                // Actualizar la habilidad comprada en el espacio disponible
                const updates = {};
                updates[`users/${username}/gold`] = userGold - skillPrice;
                updates[`users/${username}/character/purSkills/${purchasedSkillSlot}`] = {
                    t: rec.skill, // Cambiar al tipo de habilidad correcto
                    l: 1,
                    wea: rec.weapon, // Cambiar al arma correcta
                    k: rec.kind,
                    Bp: parseInt(price)
                };

                // Realizar las actualizaciones en la base de datos
                await database.ref().update(updates);

                // Envía una respuesta al cliente indicando la compra exitosa
                data.buyStatus = "success"

            } else {

                data.buyStatus = "noSpace"

            }
            
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)   

            
        } else if (rec.men == 'updateSkillSlot'){ //We put skills in the right slots
            const username = rec.user;
            const skillFrom = rec.skillFrom;
            const skillTo = rec.skillTo;
            const kind = rec.kind; // 'a' for active, 'p' for passive
        
            // Obtener la información de la habilidad desde "purSkills"
            const snapshot = await database.ref("users").child(username).child("character").child("purSkills").child(skillFrom).once("value");
            const skillData = snapshot.val();

            
            let skillresult = await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").once("value");

            let skillList = skillresult.val();
            
            for (let skill in skillList) {
                if (skillList[skill].t == skillData.t){
                    let resetSkill = { t: "n"};
                    await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").child(skill).set(resetSkill);
                    break;
                }
            }

            // Colocar la habilidad en el slot de destino
            const skillInfo = { t: skillData.t };
            await database.ref("users").child(username).child("character").child(kind === 'a' ? "actSkills" : "pasSkills").child(skillTo).set(skillInfo);

            let data = {}
            data.men = "slotUpdated"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "upgradeSkill"){ // We upgrade skills
            const username = rec.user;

            let level = await database.ref("users").child(username).child("character").child("purSkills").child(rec.slot).child("l").once("value");
            level = level.val()

            let userGold = await database.ref("users").child(username).child("gold").once("value");
            userGold = userGold.val()
        
            let basePrice = SKILLCOST[rec.skill];
            let price = (level + 1) * basePrice
            const skillPrice = parseInt(price, 10); // Price of skill to upgrade
            let data = {}
            data.men = "resUpgradeSkill"

            if (level > 9){
                data.upgStatus = "maxLevel"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            if (price > userGold){
                data.upgStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            // Upgrade skill
            const updates = {};
            updates[`users/${username}/gold`] = userGold - skillPrice;
            updates[`users/${username}/character/purSkills/${rec.slot}/l`] = level + 1; // Increment the level by 1

            // Realizar las actualizaciones en la base de datos
            await database.ref().update(updates);

            // Envía una respuesta al cliente indicando la compra exitosa
            data.upgStatus = "success"

            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


        } else if (rec.men == "sellSkill"){ // We sell our skill
            let data = {};
            data.men = "resSellSkill"

            try {
                let userGold = await database.ref("users").child(rec.user).child("gold").once("value");
                userGold = userGold.val();

                let basePrice = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("Bp").once("value");
                basePrice = basePrice.val();

                let level = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("l").once("value");
                level = level.val();

                let skillName = await database.ref("users").child(rec.user).child("character").child("purSkills").child(rec.slot).child("t").once("value");
                skillName = skillName.val()


                let priceToAdd = level * basePrice

                const updates = {};
                updates[`users/${rec.user}/gold`] = userGold + priceToAdd;
                updates[`users/${rec.user}/character/purSkills/${rec.slot}`] = {
                    t: "n", 
                    l: 0,
                    wea: "All", 
                    k: "a",
                    Bp: 0
                };

                // Realizar las actualizaciones en la base de datos
                await database.ref().update(updates);

                let skillList = await database.ref("users").child(rec.user).child("character").child(rec.kind === 'a' ? "actSkills" : "pasSkills").once("value");
                skillList = skillList.val();

                for (const skillSlot in skillList) {
                    console.log(skillList[skillSlot].t)
                    console.log(skillName)

                    if (skillList[skillSlot].t === skillName) {
                        
                        console.log("Eliminando habilidad acceso directo")
                        await database.ref("users").child(rec.user).child("character").child(rec.kind === 'a' ? "actSkills" : "pasSkills").child(skillSlot).set({ t: "n"});
                        break;
                    }
                }

                data.sellStatus = "success"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)


            } catch(err) {
                console.error('Error en la base de datos al vender: ', err);
            }

        // End skillshop---------------------------------------------------------------------- 

        } else if (rec.men == "upgWeapon") { // Weapon---------------------------------------------------------------------

            let data = {}
            data.men = "resUpgradeWeapon"

            let weaponBag = await database.ref("users").child(rec.user).child("bags").child("weaponBag").once("value");
            weaponBag = weaponBag.val();

            let items = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
            items = items.val();

            let userGold = await database.ref("users").child(rec.user).child("gold").once("value");
            userGold = userGold.val()


            let basePrice = weaponBag[rec.sw]["Bp"];
            let evoOrbs = weaponBag[rec.sw]["evoP"];
            let level = weaponBag[rec.sw]["l"];
            let grade = weaponBag[rec.sw]["g"]; 
            let evoOrbName = "";
            let evoOrbQtn = 0;
            let orbSlot = "";

            if (grade == "s"){
                evoOrbName = "simpleEvoOrb"
            }

            for (let item in items){
                if (items[item].gro !== "evo"){
                    continue
                } else {
                    if (items[item].na == evoOrbName){
                        evoOrbQtn = items[item].qtn // Current evo orbs qtn
                        orbSlot = item
                        break
                    }
                }
            }
            
            let evoNeeded = level * evoOrbs

            if (evoOrbQtn == 0 || evoNeeded > evoOrbQtn){
                data.upgStatus = "noOrbs"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            let upgPrice = basePrice * level;

            if (upgPrice > userGold){
                data.upgStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            };

            if (level > 29){
                data.upgStatus = "maxLevel"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            // Success rate
            let randomSuccess = Math.random(); //between 0 - 1

            let successFactor = 100 - (level - 1);

            if (randomSuccess > successFactor / 100) {
                data.upgStatus = "fail"

                // Downgrade weapon
                const updates = {};
                updates[`users/${rec.user}/gold`] = userGold - upgPrice;
                updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                let newLevel = level - 2
                if (newLevel < 1){
                    newLevel = 1
                }
                updates[`users/${rec.user}/bags/weaponBag/${rec.sw}/l`] = newLevel; // Decrease the level by 2

                // Update Db
                await database.ref().update(updates);

                // If orbs qtn is 0 we delete item from db
                if ((evoOrbQtn - evoNeeded) == 0){
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(orbSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                }

                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)

                return
            } else {
                // Upgrade weapon
                const updates = {};
                updates[`users/${rec.user}/gold`] = userGold - upgPrice;
                updates[`users/${rec.user}/bags/weaponBag/${rec.sw}/l`] = level + 1; // Increment the level by 1
                updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                // Realizar las actualizaciones en la base de datos
                await database.ref().update(updates);

                // If orbs qtn is 0 we delete item from db
                if ((evoOrbQtn - evoNeeded) == 0){
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(orbSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                }

                // Envía una respuesta al cliente indicando la compra exitosa
                data.upgStatus = "success"

                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }


        } else if (rec.men == "equipWeapon") { 

            const username = rec.user;
            const weaponSlot = rec.slot;
        
            // Get all weapons bag
            const snapshot = await database.ref("users").child(username).child("bags").child("weaponBag").once("value");
            const weaponData = snapshot.val();

            try {
                for (let weapon in weaponData){
                    await database.ref("users").child(username).child("bags").child("weaponBag").child(weapon).child("est").set("n")
                }
            } catch (error) {
                console.error(error)
            }
            //change estate of selected weapon to equipped
            await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("est").set("e")
            
            let data = {}
            data.men = "weaponEquipped"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "sellWeapon") { 
            const username = rec.user;
            const weaponSlot = rec.sw;

            const slevel = await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("l").once("value");
            const level = slevel.val();

            const sbp = await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).child("Bp").once("value");
            const bp = sbp.val();

            const sgold = await database.ref("users").child(username).child("gold").once("value");
            const gold = sgold.val();

            const sellPrice = Math.round((bp * level)/2)            

            //Add gold
            await database.ref("users").child(username).child("gold").set(gold + sellPrice)

            //Removing weapon
            await database.ref("users").child(username).child("bags").child("weaponBag").child(weaponSlot).set({cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"});

            let data = {}
            data.men = "weaponSold"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        
        //END WEAPON--------------------------------------------------------------------------------------------------------

        //ARMORS------------------------------------------------------------------------------------------------------------
        } else if (rec.men == "upgArmor") {

            let data = {}
            data.men = "resUpgradeArmor"

            let userGold = await database.ref("users").child(rec.user).child("gold").once("value");
            userGold = userGold.val();

            let armorBag = await database.ref("users").child(rec.user).child("bags").child("armorBag").once("value");
            armorBag = armorBag.val();

            let items = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
            items = items.val();

            let basePrice = armorBag[rec.sa]["Bp"];
            let evoOrbs = armorBag[rec.sa]["evoP"];
            let level = armorBag[rec.sa]["l"];
            let grade = armorBag[rec.sa]["g"];
            let evoOrbName = "";
            let evoOrbQtn = 0;
            let orbSlot = "";

            if (grade == "s"){
                evoOrbName = "simpleEvoOrb";
            };

            for (let item in items){
                if (items[item].gro == "evo"){
                    if (items[item].na == evoOrbName){
                        evoOrbQtn = items[item].qtn
                        orbSlot = item
                        break
                    }
                }
            }
            
            let evoNeeded = level * evoOrbs

            if (evoOrbQtn == 0 || evoNeeded > evoOrbQtn){
                data.upgStatus = "noOrbs"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }
            let upgPrice = basePrice * level;

            if (upgPrice > userGold){
                data.upgStatus = "noGold"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            if (level > 29){
                data.upgStatus = "maxLevel"
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            // Success rate
            let randomSuccess = Math.random(); //between 0 - 1

            let successFactor = 100 - (level - 1);

            if (randomSuccess > successFactor / 100) {
                data.upgStatus = "fail"

                // Downgrade armor
                const updates = {};
                updates[`users/${rec.user}/gold`] = userGold - upgPrice;

                updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                let newLevel = level - 2
                if (newLevel < 1){
                    newLevel = 1
                }
                updates[`users/${rec.user}/bags/armorBag/${rec.sa}/l`] = newLevel; // Decrease the level by 2

                // Update Db
                await database.ref().update(updates);

                // If orbs qtn is 0 we delete item from db
                if ((evoOrbQtn - evoNeeded) == 0){
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(orbSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                }

                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return

            } else {
                 // Upgrade armor
                    const updates = {};
                    updates[`users/${rec.user}/gold`] = userGold - upgPrice;
                    updates[`users/${rec.user}/bags/armorBag/${rec.sa}/l`] = level + 1; // Increment the level by 1
                    updates[`users/${rec.user}/bags/itemBag/${orbSlot}/qtn`] = evoOrbQtn - evoNeeded;

                    // Realizar las actualizaciones en la base de datos
                    await database.ref().update(updates);

                    // Envía una respuesta al cliente indicando la compra exitosa
                    data.upgStatus = "success"

                    // If orbs qtn is 0 we delete item from db
                    if ((evoOrbQtn - evoNeeded) == 0){
                        await database.ref("users").child(rec.user).child("bags").child("itemBag").child(orbSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                    }

                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
            }

        }else if (rec.men == "equipArmor") { 

            const username = rec.user;
            const armorSlot = rec.slot;
        
            // Get all weapons bag
            const snapshot = await database.ref("users").child(username).child("bags").child("armorBag").once("value");
            const armorData = snapshot.val();

            try {
                for (let armor in armorData){
                    await database.ref("users").child(username).child("bags").child("armorBag").child(armor).child("est").set("n")
                }
            } catch (error) {
                console.error(error)
            }



            //change estate of selected weapon to equipped
            await database.ref("users").child(username).child("bags").child("armorBag").child(armorSlot).child("est").set("e")
            

            let data = {}
            data.men = "armorEquipped"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "sellArmor") { 
            const username = rec.user;
            const armorSlot = rec.sa;

            const slevel = await database.ref("users").child(username).child("bags").child("armorBag").child(armorSlot).child("l").once("value");
            const level = slevel.val();

            const sbp = await database.ref("users").child(username).child("bags").child("armorBag").child(armorSlot).child("Bp").once("value");
            const bp = sbp.val();

            const sgold = await database.ref("users").child(username).child("gold").once("value");
            const gold = sgold.val();

            const sellPrice = Math.round((bp * level)/2)
            

            //Add gold
            await database.ref("users").child(username).child("gold").set(gold + sellPrice)

            //Removing weapon
            await database.ref("users").child(username).child("bags").child("armorBag").child(armorSlot).set({cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"});

            let data = {}
            data.men = "armorSold"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "sellItems") {             

            let item = await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.slot).once("value");
            item = item.val();

            let gold = item.pri * rec.qtn
            let qtn = item.qtn - rec.qtn
            if (qtn < 1){
                if (item.gro == "pot"){
                    let pot1 = await database.ref("users").child(rec.user).child("pot1").once("value");
                    pot1 = pot1.val();
                    let pot2 = await database.ref("users").child(rec.user).child("pot2").once("value");
                    pot2 = pot2.val();
                    if (pot1 == item.na){
                        await database.ref("users").child(rec.user).child("pot1").set("n")
                    }
                    if (pot2 == item.na){
                        await database.ref("users").child(rec.user).child("pot2").set("n")
                    }
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.slot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                } else {
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.slot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                }

            } else {
                await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.slot).child("qtn").set(qtn)
            }

            //Add gold
            await database.ref("users").child(rec.user).child("gold").set(firebase.database.ServerValue.increment(gold))

            let data = {}
            data.men = "itemSold"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "setupPotion"){

            await database.ref("users").child(rec.user).child(rec.slot).set(rec.potion)

            let data = {}
            data.men = "potionSetup"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "openBox"){

            let box = boxes[rec.boxType];
            let items = Object.keys(box);
            let probabilities = Array(items.length).fill(1 / items.length);

            if (rec.sucArt != "n") {
                await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.sucArtSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"});
                let index = items.indexOf(rec.item);
                probabilities[index] += parseFloat(rec.sucArt);
                let itemPro = probabilities[index]

                let remainingProb = 1 - probabilities.reduce((a, b) => a + b, 0);
                let remainingItems = items.length - 1;
                for (let i = 0; i < probabilities.length; i++) {
                    if (i !== index) {
                        probabilities[i] += remainingProb / remainingItems;
                    }
                }
            }

            let random = Math.random();
            let cumulativeProbability = 0;
            let itemIndex = 0;
            for (let i = 0; i < probabilities.length; i++) {
                cumulativeProbability += probabilities[i];
                if (random < cumulativeProbability) {
                    itemIndex = i;
                    break;
                }
            }

            let prize = box[items[itemIndex]]
            let data = {}

            // Verify if we have enough space in bag to allocate all the prices, if not, we send a Success:false
            // Verify if item is a weapon
            if (prize.gro == "wea"){
                let spaceFound = false
                let slot = null
                let weaponBag = await database.ref("users").child(rec.user).child("bags").child("weaponBag").once("value");
                weaponBag = weaponBag.val();
                for (let item in weaponBag){
                    if (weaponBag[item].cat == "n"){
                        spaceFound = true;
                        slot = item;
                        break;
                    }
                }
                if (spaceFound){
                    await database.ref("users").child(rec.user).child("bags").child("weaponBag").child(slot).set(prize)
                    data.men = "itemBoxAdd";
                    data.success = true;
                    //DELETE BOX
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.boxSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                    data.item = box[items[itemIndex]].t
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                } else {
                    data.men = "itemBoxAdd";
                    data.success = false;
                    data.bag = "Weapon bag"
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                    return
                }
            

            // Verify if item is an object
            } else {
                let spaceFound = false
                let slot = null
                let itemBag = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
                itemBag = itemBag.val();
                for (let item in itemBag){
                    if (itemBag[item].gro == "n"){
                        spaceFound = true;
                        slot = item;
                        break;
                    }
                }
                if (spaceFound){
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(slot).set(prize)
                    data.men = "itemBoxAdd";
                    data.success = true;
                    //DELETE BOX
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.boxSlot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})
                    data.item = box[items[itemIndex]].na
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                } else {
                    data.men = "itemBoxAdd";
                    data.success = false;
                    data.bag = "Items bag"
                    data = JSON.stringify(data)
                    data = gdCom.putVar(data)
                    ws.send(data)
                    return
                }
            }

            
        } else if (rec.men == "decompress"){
            let bag = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
            bag = bag.val();

            let compressName = bag[rec.slot]["na"];
            let itemCompress = ""
            let initialItemQtn = 0
            let itemQtn = 0;
            let spaceFound = false;
            let itemFound = false; // If item is found db saving is different
            let slot; // Save slot of the found compress item
            let data = {};

            if (compressName == "compressSimpleEO1"){
                itemCompress = "simpleEvoOrb";
                itemQtn = randomNumber(10,40);
            };

            // We look for thwe item compressed
            for (let item in bag){
                if (bag[item]["na"] == itemCompress){
                    spaceFound = true;
                    initialItemQtn = bag[item]["qtn"]
                    itemFound = true;
                    slot = item;
                    break;
                }
            }

            // If there is no compress item we look for empty space to allocate
            if (!spaceFound){
                for (let item in bag){
                    if (bag[item].gro == "n"){
                        spaceFound = true;
                        slot = item;
                        break;
                    }
                }
            }

            if (spaceFound){            
                if (itemFound){
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(slot).child("qtn").set(itemQtn + initialItemQtn)
                }else{
                    await database.ref("users").child(rec.user).child("bags").child("itemBag").child(slot).set({"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":itemQtn + initialItemQtn})
                }
                
                await database.ref("users").child(rec.user).child("bags").child("itemBag").child(rec.slot).set({gro:"n",qtn:0,na:"n",pri:0,bo:"n"})

                data.men = "decompressSuc";
                data.item = itemCompress;
                data.qtn = itemQtn;
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)

            } else { // No space in bag
                data.men = "bagFull";
                data.bag = "Items bag";
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            };

            



        
        // TUTORIALS ---------------------------------------------------------------------------
        } else if (rec.men == "finishTutorial0") {
         
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i01").set({"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":50});
            await database.ref("users").child(rec.user).child("bags").child("weaponBag").child("i01").child("est").set("e");
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial1");

            let data = {}
            data.men = "tutorial0Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial1") {
         
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i01").set({"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":100});
            await database.ref("users").child(rec.user).child("bags").child("armorBag").child("i01").child("est").set("e");
            await database.ref("users").child(rec.user).child("gold").set(1500);
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial2");

            let data = {}
            data.men = "tutorial1Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial2") {
         
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i02").set({gro:"suc",qtn:1,na:"AWsuccess10",pri:1500,bo:"y",canAdd:false});
            await database.ref("users").child(rec.user).child("character").child("purSkills").child("s01").set({t:"StrengthenedResolve",l:1, wea:"Sw","Bp":1000,k:"a"});
            await database.ref("users").child(rec.user).child("gold").set(2000);
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial3");

            let data = {}
            data.men = "tutorial2Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial3") {
         
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i03").set({gro:"suc",qtn:1,na:"AWsuccess10",pri:1500,bo:"y",canAdd:false});
            await database.ref("users").child(rec.user).child("character").child("actSkills").child("s01").child("t").set("StrengthenedResolve");
            await database.ref("users").child(rec.user).child("gold").set(2500);
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial4");

            let data = {}
            data.men = "tutorial3Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial4") {
         
            await database.ref("users").child(rec.user).child("gold").set(4500);
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial5");
            await database.ref("users").child(rec.user).child("quests").child("npc").set("NPC_SandSurvivor");
            // l: looking for quest, a: accepted (question mark unactive), t: "talk (question mark active)"
            await database.ref("users").child(rec.user).child("quests").child("npcSta").set("l");

            let data = {}
            data.men = "tutorial4Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial6") {
         
            await database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial7");
            await database.ref("users").child(rec.user).child("gold").set(4500);
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i01").set({"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":100});
            await database.ref("users").child(rec.user).child("bags").child("weaponBag").child("i01").child("l").set(2);

            let data = {}
            data.men = "tutorial6Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishTutorial7") {
         
            await database.ref("users").child(rec.user).child("quests").child("n").set("FinalTutorial");
            await database.ref("users").child(rec.user).child("gold").set(4500);
            await database.ref("users").child(rec.user).child("bags").child("itemBag").child("i01").set({"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":100});
            await database.ref("users").child(rec.user).child("bags").child("armorBag").child("i01").child("l").set(2);

            let data = {}
            data.men = "tutorial7Finished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "finishFinalTutorial") {
         
            await database.ref("users").child(rec.user).child("quests").child("n").set("n");

            //console.log("quest updated")

            let data = {}
            data.men = "finalTutorialFinished"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)
            
        // END TUTORIALS ---------------------------------------------------------------------------

        // ADVENTURE MODE --------------------------------------------------------------------------------------------
        } else if (rec.men == "savePlayer"){
            let mainMap = null

            if (rec.map == "DOE1"){
                mainMap = AdventureMapsA
            }


            ws.username = rec.username;
            ws.player = null
            ws.adventure = true;
            ws.map = rec.map;
            ws.mapVariation = null;
            ws.pName1 = rec.pName1; // Potion name
            ws.pSlot1 = rec.pSlot1; // potion Position un bag ("i01, i02, etc")
            ws.acPotion1 = 0; // To know how many potions we used before sending to the DB
            ws.totalPotions1 = rec.totalPotions1; // To know how many potions we had in the begin of the game and avoid hacking
            ws.pName2 = rec.pName2;
            ws.pSlot2 = rec.pSlot2;
            ws.acPotion2 = 0; 
            ws.totalPotions2 = rec.totalPotions2; 

            mainMap[rec.map]["Players"][rec.username] = {
                "maxHp":rec.Hp, "Hp":rec.Hp, "aGra":"n", "aName":"n", "wCat":rec.wCat, "wName":rec.wName, "posX":800, "posY":800, "efs":{}
            }

            mainMap[rec.map]["Sockets"][rec.username] = ws 
            
            let data = {}
            data.men = "playerSaved"
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "getQuest"){

            let quests = await database.ref("users").child(rec.user).child("quests").once("value");
            quests = quests.val();

            let data = {}
            data.men = "questGotten"
            data.quests = quests
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "getAdventureMap"){
            let data = {}
            data.men = "AdventureMapGotten"

            let mapData = {}
            let mainMap = null

            if (rec.map == "DOE1"){ mainMap = AdventureMapsA };

            mapData["Players"] = mainMap[rec.map]["Players"];
            mapData["Mobs"] = mainMap[rec.map]["Mobs"];
            mapData["InvObjects"] = mainMap[rec.map]["InvObjects"];

            data.mapData = mapData
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "skillSentAdv"){
            let mainMap = null

            if (rec.map == "DOE1"){mainMap = AdventureMapsA};

            for (let pSocket in mainMap[rec.map]["Sockets"]){
                let data = {}
                data.men = "skillActivatedAdv"
                data.skillName = rec.skillName
                data.username = rec.player
                data.target = rec.target
                data = JSON.stringify(data)
                data = gdCom.putVar(data)

                mainMap[rec.map]["Sockets"][pSocket].send(data)
            }

        } else if (rec.men == 'updatePosAdv') { //We update player position in the map

            let mainMap = null

            if (rec.map == "DOE1"){
                mainMap = AdventureMapsA
            }

            if (mainMap[rec.map]["Players"].hasOwnProperty(rec.username)){
                mainMap[rec.map]["Players"][rec.username].posX = rec.x
                mainMap[rec.map]["Players"][rec.username].posY = rec.y
            }

        } else if (rec.men == 'attackMob') { //We attack mobs

            let mainMap
            if (rec.map == "DOE1"){mainMap = AdventureMapsA}

            if (mainMap[rec.map]["Mobs"][rec.enemy].alive){
                // Get long range enemy
                if (mainMap[rec.map]["Mobs"][rec.enemy].enemy == "n"){
                    if (mainMap[rec.map]["Players"].hasOwnProperty(rec.user)){
                        mainMap[rec.map]["Mobs"][rec.enemy].enemy = rec.user
                    }
                }
                mainMap[rec.map]["Mobs"][rec.enemy].Hp -= rec.atk
                if (mainMap[rec.map]["Mobs"][rec.enemy].Hp < 1){
                    mainMap[rec.map]["Mobs"][rec.enemy].alive = false
                    if (mainMap[rec.map]["Mobs"][rec.enemy].specie == "Khonsu"){
                        mainMap[rec.map]["Mobs"][rec.enemy].RbTime = Date.now() + 50000 // Alive in 50 seconds
                    } else {
                        mainMap[rec.map]["Mobs"][rec.enemy].RbTime = Date.now() + 20000 // Alive in 20 seconds
                    }
                } else {
                    if (rec.effect != "n"){
                        if (rec.effect == "SDss"){ // StoneShot slow down 50% for 3 seconds
                            mainMap[rec.map]["Mobs"][rec.enemy]["efs"][rec.effect] = Date.now() + 3000
                        }
                    }
                }
            }

            let data = {}
            data.men = "dmgAnim"
            data.mob = rec.enemy
            data.dmgGot = rec.atk
            data.crit = rec.critical
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


        } else if (rec.men == 'mobIsAttacking') { //Mobs attack us

            let mainMap
            if (rec.map == "DOE1"){mainMap = AdventureMapsA}

            if (mainMap[rec.map]["Players"].hasOwnProperty(rec.enemy)){
                mainMap[rec.map]["Mobs"][rec.mob].enemy = rec.enemy
                mainMap[rec.map]["Players"][rec.enemy].Hp -= rec.atk
                if (mainMap[rec.map]["Players"][rec.enemy].Hp < 1){
                    delete mainMap[rec.map]["Players"][rec.enemy]
                }
            }  

        } else if (rec.men == "hideObject") { // Hide invocation object
            let mainMap
            if (rec.map == "DOE1"){mainMap = AdventureMapsA}

            mainMap[rec.map]["InvObjects"][rec.object].shown = false
            mainMap[rec.map]["InvObjects"][rec.object].RbTime = Date.now() + 50000 // show in 50 seconds


        } else if (rec.men == "acceptQuest"){            
            await database.ref("users").child(rec.user).child("quests").set({"n":rec.qn,"map":rec.map,"s":0})

            let quests = await database.ref("users").child(rec.user).child("quests").once("value");
            quests = quests.val();
            
            let data = {}
            data.men = "questGotten"
            data.quests = quests
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)


        } else if (rec.men == "completeStepQuest"){

            let step = await database.ref("users").child(rec.user).child("quests").child("s").once("value");
            step = step.val();

            step = step + 1

            await database.ref("users").child(rec.user).child("quests").child("s").set(step);

            let quests = await database.ref("users").child(rec.user).child("quests").once("value");
            quests = quests.val();

            let data = {}
            data.men = "questGotten"
            data.quests = quests
            data = JSON.stringify(data)
            data = gdCom.putVar(data)
            ws.send(data)

        } else if (rec.men == "completeQuest"){ // Server manages all the prizes to avoid cheating

            let prizes
            let data = {}
            let questGold = 0

            // Definimos los premios según la misión
            if (rec.qn == "SandSurvivorTutorial"){
                questGold = 1000
                prizes = [
                    {"gro":"pot","na":"smallHpPotion","pri":20,"canAdd":true,"bo":"n","qtn":20}
                ]

            } else if (rec.qn == "LostInSand"){
                questGold = 200
                prizes = [
                    {"gro":"pot","na":"smallHpPotion","pri":20,"canAdd":true,"bo":"n","qtn":20},
                    {"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":10}
                ]

            } else if (rec.qn == "TheCondemned"){
                questGold = 300
                prizes = [
                    {"gro":"box","na":"simpleWeaponBox","pri":50,"canAdd":false,"bo":"n","qtn":1},
                    {"gro":"evo","na":"simpleEvoOrb","pri":10,"canAdd":true,"bo":"n","qtn":20}
                ]
            }

            // Verify if we have enough space in bag to allocate all the prices, if not, we send a Success:false
            let itemCount = prizes.length
            let itemIterator = 0
            let itemBag = await database.ref("users").child(rec.user).child("bags").child("itemBag").once("value");
            itemBag = itemBag.val();
            for (let item in itemBag){
                if (itemBag[item].gro == "n"){
                    itemIterator += 1
                }
            }
            if (itemIterator < itemCount){
                data.men = "questPrizeAdd";
                data.success = false;
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
                return
            }

            // Creamos un array de promesas con el método map
            let promises = prizes.map(prize => addPrize(prize, rec.user));

            // Esperamos a que se resuelvan todas las promesas
            Promise.all(promises).then(results => {
                // On tutorial quests we get automatically next quest
                if (rec.qn == "SandSurvivorTutorial"){
                    database.ref("users").child(rec.user).child("quests").child("n").set("Tutorial6");
                    database.ref("users").child(rec.user).child("quests").child("s").set(0);
                } else {
                    database.ref("users").child(rec.user).child("quests").set({"map":"n","n":"n","s":0});
                }
                // Creamos el objeto data con la función definida anteriormente
                data = createData(rec.qn, questGold, prizes);
                data = JSON.stringify(data)
                data = gdCom.putVar(data)
                ws.send(data)
            }).catch(error => {
                // Manejamos el posible error de alguna promesa
                console.error(error);
            });
            
        } else if (rec.men == "usePotion"){
            let mainMap
            if (ws.map == "DOE1"){mainMap = AdventureMapsA}
            
            if (!mainMap[ws.map]["Players"].hasOwnProperty(rec.user)){
                return
            }

            let potFx = ""

            if (rec.potion == "Pot1"){
                if (ws.hasOwnProperty("acPotion1")){
                    if (ws.acPotion1 < ws.totalPotions1){
                        let healingPoints = 0
                        if (ws.pName1 == "smallHpPotion"){ 
                            healingPoints = 50 
                            potFx = "Heal1"
                        }

                        if (mainMap[ws.map]["Players"][rec.user].Hp + healingPoints > mainMap[ws.map]["Players"][rec.user].maxHp){
                            mainMap[ws.map]["Players"][rec.user].Hp = mainMap[ws.map]["Players"][rec.user].maxHp
                        } else {
                            mainMap[ws.map]["Players"][rec.user].Hp += healingPoints
                        }

                        ws.acPotion1 += 1;
                        let data = {};
                        data.men = "potionUsed"
                        data.potion = "pot1"
                        data.fx = potFx
                        data = JSON.stringify(data)
                        data = gdCom.putVar(data)
                        ws.send(data)
                    }
                }    
            }

            if (rec.potion == "Pot2"){
                if (ws.hasOwnProperty("acPotion2")){
                    if (ws.acPotion2 < ws.totalPotions2){
                        let healingPoints = 0
                        if (ws.pName2 == "smallHpPotion"){ 
                            healingPoints = 50 
                            potFx = "Heal1"
                        }

                        if (mainMap[ws.map]["Players"][rec.user].Hp + healingPoints > mainMap[ws.map]["Players"][rec.user].maxHp){
                            mainMap[ws.map]["Players"][rec.user].Hp = mainMap[ws.map]["Players"][rec.user].maxHp
                        } else {
                            mainMap[ws.map]["Players"][rec.user].Hp += healingPoints
                        }

                        ws.acPotion2 += 1;
                        let data = {};
                        data.men = "potionUsed"
                        data.potion = "pot2"
                        data.fx = potFx
                        data = JSON.stringify(data)
                        data = gdCom.putVar(data)
                        ws.send(data)
                    }
                }    
            }
            

        } else if (rec.men == "die"){
            let mainMap
            if (rec.map == "DOE1"){mainMap = AdventureMapsA}

            delete mainMap[rec.map]["Players"][rec.user];
        }

    })
})

function createData(missionName, goldQtn, prizes) {
    let data = {};
    let prizesInfo = [];
    let gold = goldQtn;
    data.men = "questPrizeAdd";
    data.questName = missionName;

    // Iteramos sobre los premios para obtener la información
    prizes.forEach(prize => {
        prizesInfo.push([prize.na,prize.qtn]);
    });

    // Asignamos los valores al objeto data
    data.success = true; // Suponemos que todos los premios se añaden correctamente
    data.prizesGotten = prizesInfo;
    data.gold = gold;

    // Devolvemos el objeto data
    return data;
}

async function addPrize(prize, user){
    let itemBag = await database.ref("users").child(user).child("bags").child("itemBag").once("value");
    itemBag = itemBag.val();

    let itemFound = false // If we found an item that canAdd we proceed to add quantity

    let slot = "" // We save here the bag slot if we found an empty space or if we add some
    
    for (let item in itemBag){
        if (itemBag[item].gro == prize.gro && itemBag[item].na == prize.na && itemBag[item].canAdd){     
            slot = item;
            itemFound = true
            break;
        }
    }

    if (itemFound){
        itemBag[slot].qtn += prize.qtn
        await database.ref("users").child(user).child("bags").child("itemBag").child(slot).child("qtn").set(itemBag[slot].qtn);

    } else { // We did not found, create a new element if available
        for (let item in itemBag){
            if (itemBag[item].gro == "n"){
                slot = item
                await database.ref("users").child(user).child("bags").child("itemBag").child(slot).set(prize);
                return true;
                break;
            }
        }
    }            
};

function DOE1Checker(){
    //Object.keys(json).length === 0
    if (Object.keys(AdventureMapsA.DOE1.Players) < 1){
        //console.log("No hay jugadores en DOE1")
        for (let mob in AdventureMapsA.DOE1.Mobs){
            AdventureMapsA.DOE1.Mobs[mob].enemy = "n"
        }
        return
    } else {
        for (let mob in AdventureMapsA.DOE1.Mobs){
            if (AdventureMapsA.DOE1.Mobs[mob].alive == false){
                if (AdventureMapsA.DOE1.Mobs[mob].RbTime == 0){
                    continue;
                }
                if (Date.now() > AdventureMapsA.DOE1.Mobs[mob].RbTime){
                    AdventureMapsA.DOE1.Mobs[mob].alive = true
                    if (AdventureMapsA.DOE1.Mobs[mob].specie == "Ankhet"){
                        AdventureMapsA.DOE1.Mobs[mob].Hp = 50                    
                    } else if (AdventureMapsA.DOE1.Mobs[mob].specie == "Apofis"){
                        AdventureMapsA.DOE1.Mobs[mob].Hp = 70
                    } else if (AdventureMapsA.DOE1.Mobs[mob].specie == "Khonsu"){
                        AdventureMapsA.DOE1.Mobs[mob].Hp = 1000
                    }
                    AdventureMapsA.DOE1.Mobs[mob].enemy = "n" 
                }
            
            } else {

                if (Object.keys(AdventureMapsA.DOE1.Mobs[mob].efs).length > 0){
                    for (let effect in AdventureMapsA.DOE1.Mobs[mob].efs){
                        if (Date.now() > AdventureMapsA.DOE1.Mobs[mob]["efs"][effect]){
                            delete AdventureMapsA.DOE1.Mobs[mob]["efs"][effect]
                        }
                    }
                }

                let mini = 0
                let maxi = 0
                if (AdventureMapsA.DOE1.Mobs[mob].specie == "Ankhet") {
                    mini = 100;
                    maxi == 291;
                } else if (AdventureMapsA.DOE1.Mobs[mob].specie == "Apofis"){
                    mini = 200;
                    maxi == 401;
                }

                if (AdventureMapsA.DOE1.Mobs[mob].enemy == "n"){

                    let mobUpd = AdventureMapsA.DOE1.Mobs[mob]
                    let rPosX = Math.floor(Math.random() * (maxi-mini) + mini);// Returns a random integer from 100 to 290
                    let rPosY = Math.floor(Math.random() * (maxi-mini) + mini);
                    let choices = ['add', 'sub'];
                    let choiceX = choices[Math.floor(Math.random() * choices.length)];
                    let choiceY = choices[Math.floor(Math.random() * choices.length)];
                    if (choiceX == "add"){
                        mobUpd.posX = mobUpd.iniPos[0] + rPosX
                    } else {
                        mobUpd.posX = mobUpd.iniPos[0] - rPosX
                    }
                    if (choiceX == "add"){
                        mobUpd.posY = mobUpd.iniPos[1] + rPosY 
                    } else {
                        mobUpd.posY = mobUpd.iniPos[1] - rPosY 
                    }

                } else {

                    if (AdventureMapsA.DOE1.Players.hasOwnProperty(AdventureMapsA.DOE1.Mobs[mob].enemy)){

                        AdventureMapsA.DOE1.Mobs[mob].posX = AdventureMapsA.DOE1.Players[AdventureMapsA.DOE1.Mobs[mob].enemy].posX
                        AdventureMapsA.DOE1.Mobs[mob].posY = AdventureMapsA.DOE1.Players[AdventureMapsA.DOE1.Mobs[mob].enemy].posY

                        

                    } else {
                        AdventureMapsA.DOE1.Mobs[mob].enemy = "n"
                    }

                } 
            }
        }

        for (let obj in AdventureMapsA.DOE1.InvObjects){
            if (AdventureMapsA.DOE1.InvObjects[obj].shown == false){
                if (AdventureMapsA.DOE1.InvObjects[obj].RbTime == 0){
                    continue;
                }
                if (Date.now() > AdventureMapsA.DOE1.InvObjects[obj].RbTime){
                    AdventureMapsA.DOE1.InvObjects[obj].shown = true
                    AdventureMapsA.DOE1.InvObjects[obj].RbTime = 0
                }
            }
        }
    }

}

setInterval(DOE1Checker, 1500); //We check if thereare players in DOE1 each second, if not return

// función asincrónica para verificar y agregar un usuario a la base de datos
async function agregarUsuario(username, password, email) {
    try {
        // Verificar si el usuario ya existe en la base de datos
        const snapshot = await database.ref("users").child(username).once("value");
        if (snapshot.exists()) {
            // Si ya existe el usuario, devuelve un mensaje de error al cliente
            return { mensaje: 'userExists', error: 'El usuario ya existe en la base de datos' };
        } else {
            // Si no existe, agregar el nuevo usuario a la base de datos
            await database.ref("users").child(username).set({
                username: username,
                password: password,
                mail: email,
                gold:1000,
                diamond:0,
                pot1:"smallHpPotion",
                pot2:"n",
                quests: {
                    n:"Tutorial0", // quest name,
                    s:0, // quest steps 
                    t:"", // type: kill, search or talk
                    npc:"", // quest NPC
                    npcSta:"", // l: looking for quest, a: accepted (question mark unactive), t: "talk (question mark active)"
                    tar: {"n":"","qtn":0}
               },
                checkPoint: "checkPointDOE",
                character: {
                    costume:"n",
                    soulHeart:"n",
                    actSkills: {
                        //s1: {t:"StrengthenedResolve"},
                        s01: {t:"n"},
                        s02: {t:"n"},
                        s03: {t:"n"},
                        s04: {t:"n"},
                        s05: {t:"n"},
                        s06: {t:"n"}
                    },
                    pasSkills: {
                        s01: {t:"n"},
                        s02: {t:"n"},
                        s03: {t:"n"},
                        s04: {t:"n"},
                        s05: {t:"n"},
                        s06: {t:"n"}
                    },
                    purSkills: {
                        s01: {t:"n",l:0, wea:"Any","Bp":0,k:"a"}, 
                        //s1: {t:"StrengthenedResolve",l:1, wea:"Sw","Bp":1000,k:"a"}, //k is kind active or passive
                        s02: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s03: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s04: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s05: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s06: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s07: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s08: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s09: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s10: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s11: {t:"n",l:0, wea:"Any","Bp":0,k:"a"},
                        s12: {t:"n",l:0, wea:"Any","Bp":0,k:"a"}
                    }

                },
                bags: {
                    itemBag: {
                        i01:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i02:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i03:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i04:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i05:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i06:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i07:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i08:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i09:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i10:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i11:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i12:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i13:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i14:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i15:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i16:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i17:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i18:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i19:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i20:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i21:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i22:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i23:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i24:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i25:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i26:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i27:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i28:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i29:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"},
                        i30:{gro:"n",qtn:0,na:"n",pri:0,bo:"n"}
                    },
                    weaponBag: {
                        i01:{"gro":"wea","cat":"Sw","t":"basicStick","l":1,"g":"s", "se1":"n", "se2":"n", "se3":"n","Bp":50, "evoP": 10, "est":"n","bo":"n"}, //bo is bound
                        //i02:{"gro":"wea",cat:"Sw",t:"simpleSword",l:1,g:"s", se1:"n", se2:"n", se3:"n",Bp:75, evoP: 15, est:"n",bo:"n"},
                        i02:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i03:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i04:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i05:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"},
                        i06:{cat:"n",t:"n",l:1,s:"n",est:"n",bo:"n"}
                    },
                    armorBag: {
                        i01:{t:"sageMetalCopper",l:1,g:"s",se1:"n",se2:"n",s3:"n",Bp:50, evoP: 10, est:"n",bo:"n"},
                        //i02:{t:"rollMetalTunic",l:1,g:"s",se1:"n",se2:"n",s3:"n",Bp:100, evoP: 15, est:"n",bo:"n"},
                        i02:{t:"n", est:"n"},
                        i03:{t:"n", est:"n"},
                        i04:{t:"n", est:"n"},
                        i05:{t:"n", est:"n"},
                        i06:{t:"n", est:"n"},
                        i07:{t:"n", est:"n"},
                        i08:{t:"n", est:"n"},
                        i09:{t:"n", est:"n"},
                        i10:{t:"n", est:"n"},
                        i11:{t:"n", est:"n"},
                        i12:{t:"n", est:"n"}
                    }
                },
                avatars: {
                    main: "voidBorneBasic",
                    av1: "voidBorneBasic",
                    av2: "n",
                    av3: "n",
                    av4: "n",
                    av5: "n"
                }                
            });
            // Devolver un mensaje de éxito al cliente
            return { mensaje: 'regSuccess', data: 'Usuario agregado correctamente' };
        }
    } catch (err) {
        // Si ocurre un error en la base de datos, devuelve un mensaje de error al cliente
        console.error('Error en la base de datos: ', err);
        return { mensaje: 'dbError', error: 'Error en la base de datos' };
    }
}


  // Para el login
async function verificarUsuario(username, password) {
    try {
      // Obtener la referencia al nodo "users"
      const usersRef = database.ref('users');
  
      // Consultar la base de datos para obtener el usuario con el username dado
      const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
      const user = snapshot.val();
  
      if (!user) {
        return { mensaje: 'noExists' };
      } else {
        // Obtenemos el primer usuario del resultado de la consulta (debería ser único)
        const userId = Object.keys(user)[0];
        const userData = user[userId];
  
        if (userData.password !== password) {
            return { mensaje: 'invalidPassword' };
        } else {
            return { mensaje: 'success' };
        }
      }
    } catch (error) {
        console.log('Error en la base de datos: ', error);
        return { mensaje: 'dbError', error: 'Error en la base de datos' };
    }
  }
  
  
//Look for empty spaces in maps
async function findAvailableSpace(usernamec, mapName, maxHp, pDef, wname, wcat, wlevel, aname, agrade, alevel) {
    const map = maps[mapName];
    if (!map) {
        return { success: false, message: "Map not found" };
    }
    for (let variation in map) {
        const players = map[variation]["Players"];
        const status = map[variation]["status"];
        console.log("Estamos en: ")
        console.log(variation)
        if (status === "playing") { //Era: status && status === "playing"
            console.log("El juego está en playing, pasamos al siguiente")
            continue; // Si la variación está en juego, pasar a la siguiente
        } else {
            for (let player in players) {
                if (players[player] === "none") {
                    // Creamos a nuestro jugador, acá se pondrán en un futuro todas las mejoras
                    let posX = 0
                    let posY = 0

                    // Mapa multijugador LOST EDEN
                    if (mapName == "lostEden"){
                        const mapSize = 10240
                        if (player === "player1"){
                            posX = mapSize - 450
                            posY = 1200
                        } else if (player === "player2"){
                            posX = mapSize / 3 * 2
                            posY = 1200
                        } else if (player === "player3"){
                            posX = mapSize / 3
                            posY = 1200
                        } else if (player === "player4"){
                            posX = 450
                            posY = 1200
                        } else if (player === "player5"){
                            posX = mapSize / 2 - 2000
                            posY = mapSize / 2
                        } else if (player === "player6"){
                            posX = mapSize / 2 + 2000
                            posY = mapSize / 2
                        } else if (player === "player7"){
                            posX = 450
                            posY = mapSize - 450
                        } else if (player === "player8"){
                            posX = mapSize / 3
                            posY = mapSize - 450
                        } else if (player === "player9"){
                            posX = mapSize / 3 * 2
                            posY = mapSize - 450
                        } else if (player === "player10"){
                            posX = mapSize - 450
                            posY = mapSize - 450
                        }
                    }

                    players[player] = { 
                        username:usernamec,
                        type:"human",
                        master:"no",
                        maxhp: maxHp,
                        hp: maxHp,
                        pDef: pDef,
                        posx: posX,
                        posy: posY,
                        status: "I",
                        wName:wname,
                        wCat:wcat,
                        wLevel:wlevel,
                        aName:aname,
                        aGrade:agrade,
                        aLevel:alevel,
                        efs:{}
                    };

                    map[variation]["acuWeaponLevel"] += wlevel
                    map[variation]["acuArmorLevel"] += alevel
                    map[variation]["acuHp"] += maxHp
                    map[variation]["humanQtn"] += 1
                    
                    map[variation]["status"] = "waiting"; // Actualizar el estado de la variación
                    //console.log("Jugador creado en: ")
                    //console.log(variation)
                    //console.log(maps[mapName][variation])

                    //LOST EDEN ONLY
                    if (mapName == "lostEden"){
                        if (maps[mapName][variation].hAChoose == "no"){

                            let appleArray = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
                            if (appleArray == 1){
                                maps[mapName][variation].healApplePos = "A"
                            } else if (appleArray == 2){
                                maps[mapName][variation].healApplePos = "B"
                            } else if (appleArray == 3){
                                maps[mapName][variation].healApplePos = "C"
                            } else if (appleArray == 4){
                                maps[mapName][variation].healApplePos = "D"
                            } else if (appleArray == 5){
                                maps[mapName][variation].healApplePos = "E"
                            }

                        maps[mapName][variation].hAChoose = "yes"
                        //console.log("Se eligió como heal apple array: " + maps[mapName][variation].healApplePos)
        
                    }
            }

                    return { success: true, map: mapName, variation, player };
                }
            }

        }
    }
    return { success: false, message: "No available space found" };
}
  
//Check how many players
function checkIfPlayersAreFull(mapName, variation) {
    const map = maps[mapName];
    if (!map) {
      console.log("Map not found");
      return false;
    }
    const variationData = map[variation];
    if (!variationData) {
      console.log("Variation not found");
      return false;
    }
    
    let playerCount = 0;
    
    for (let i = 1; i <= 10; i++) {
      if (variationData["Players"]["player" + i] != "none") {
        playerCount++;
      }
    }
    
    return playerCount;
}
  
//Add bots
function isGameFull(game) {
    let playerCount = 0
    for (let player in game["Players"]){
        if (game["Players"][player] != "none"){
            playerCount += 1
        }
    }
    //const playerCount1 = Object.values(game).filter(val => typeof val === "object" && val.username !== undefined && val.username !== "gamebot").length;
    return playerCount === 10;
  }

function addBotsToWaitingGames() {
    for (let mapName in maps) {
      for (let variation in maps[mapName]) {
        let game = maps[mapName][variation];     
        
        if (game.status === "playing" || game.status === "finishing") {
            //console.log(`Juego en curso en ${variation}`);
            //console.log(game);

            // Verificamos que la partida expiró
            let limitTime = game.limitTime;
            let realLimitTime = limitTime - 5; // antes de los 5 segundos de acabar la partida botamos a los jugadores

            let currentTime = Math.floor(Date.now() / 1000);

            //console.log("Tiempo de creacion: " + realLimitTime.toString())
            //console.log("Tiempo actual: " + currentTime.toString())
            //console.log("Tiempo transcurrido: " + (realLimitTime - currentTime).toString())
            
            if (currentTime > limitTime){
                // Cambiar estado del juego a "finished"
                console.log(`El tiempo límite ha expirado en ${variation}. Terminando el juego...`);
                game.status = "waiting";
                game.hAChoose = "no";
                game.acuWeaponLevel = 0;
                game.acuArmorLevel = 0;
                game.acuHp = 0;
                game.humanQtn = 0;
                game.botNameIndex = 0;
                game.countBots = 0;
                game.moveBotsTime = 0;

                // Eliminar jugadores del juego
                for (let i = 1; i <= 10; i++) {
                    game["Players"][`player${i}`] = "none";
                }

                return;
            }

            if (currentTime > realLimitTime) {
                // Cambiar estado del juego a "finished"
                console.log(`Botando a los jugadores y despues de 5 segundos acabará la partida`);
                game.status = "finishing";

                return;
            }

            // Verificar si no hay jugadores humanos
            let HumansFound = false
            for (let player in game["Players"]){
                if (game["Players"][player] != "none"){
                    if (game["Players"][player].type == "human"){
                        HumansFound = true;
                        break;
                    }
                }
            };

            if (HumansFound == false) {
                // Cambiar estado del juego a "finished"
                console.log(`Todos los jugadores son bots o no hay jugadores humanos en ${variation}. Terminando el juego...`);
                game.status = "waiting";
                game.hAChoose = "no";
                game.acuWeaponLevel = 0;
                game.acuArmorLevel = 0;
                game.acuHp = 0;
                game.humanQtn = 0;
                game.botNameIndex = 0;
                game.countBots = 0;
                game.moveBotsTime = 0;
                
                // Eliminar jugadores del juego
                for (let player in game["Players"]){
                    game["Players"][player] = "none";
                }
                return;
            }

            //Acá actualizamos los bots de la partida para que se muevan aleatoriamente en el mapa cada 3 segundos
            //Aprovechamos el codigo para ver si hay un humano master, sino asignamos el master a otro jugador
            let hasHumanMaster = false;

            game.moveBotsTime += 1;

            for (let player in game["Players"]){                
                if (game["Players"][player] !== "none"){
                    if (game["Players"][player].type == "bot"){

                        if (game.moveBotsTime > 2){
                            let posX = vrandom.int(300, 9700)
                            let posY = vrandom.int(300, 9700)
                            game["Players"][player].posx = posX
                            game["Players"][player].posy = posY
                        }
                        
                    } else {
                        if (game["Players"][player].master == "yes"){
                            hasHumanMaster = true
                        } 
                    }              
                    
                    if (game["Players"][player].hp < 1){
                        game["Players"][player] = "none"
                    } else {
                        // Check effects
                        if (Object.keys(game["Players"][player].efs).length > 0){
                            for (let effect in game["Players"][player].efs){
                                if (Date.now() > game["Players"][player]["efs"][effect]){
                                    delete game["Players"][player]["efs"][effect]
                                }
                            }
                        }
                    }
                }
            }

            if (game.moveBotsTime > 2){
                game.moveBotsTime = 0;
            }

            // Asignar rol de MASTER al primer jugador humano si no hay un jugador con ese rol
            if (!hasHumanMaster) {
                
                for (let player in game["Players"]){
                    if (game["Players"][player] !== "none"){
                        if (game["Players"][player].type == "bot"){
    
                            continue
                            
                        } else {
                            game["Players"][player].master = "yes"
                            break
                        }              
                    }
                }

            }


        } else if (game.status === "waiting") {
            game.countBots += 1;

            let hasHumanPlayer = false;
            for (let player in game["Players"]){
                if (game["Players"][player].type == "human"){
                    hasHumanPlayer = true;
                    break;
                }
            }

            let hasBots = false;
            for (let player in game["Players"]){
                if (game["Players"][player].type == "bot"){
                    hasBots = true;
                    break;
                }
            }
            
            if (!hasHumanPlayer) {
                if (hasBots){
                    // Eliminar bots del juego
                    for (let player in game["Players"]){
                        if (game["Players"][player].type == "bot"){
                            game["Players"][player] = "none"
                        }
                    }
                    game.status = "waiting";
                    console.log("Bots eliminados de: ")
                    console.log(variation)
                }
              
            } else {

                if (game.countBots < countBotLimit){
                    return
                } else {
                    game.countBots = 0
                }

                //console.log("Se puede agregar bots en: ")
                //console.log(variation)

                let botAdded = false;
          
              for (let i = 1; i <= 10; i++) {

                let posX = 0
                let posY = 0                

                if (game["Players"][`player${i}`] === "none") {
                    //console.log("El mapa dondese agrega el bot es: " + mapName)

                    // Mapa multijugador LOST EDEN
                    if (mapName == "lostEden"){                       

                        //Bot Armor
                        let simpleArmors = ["sageMetalCopper","rollMetalTunic"] //For bots
                        let armorIndex = Math.floor(Math.random() * simpleArmors.length);
                        let selectedArmor = simpleArmors[armorIndex];
                        let armorGrade = "s"


                        //Bot Weapon
                        let simpleWeapon = ["basicStick","simpleSword","simpleStaff","simpleGun","simpleKillers"] //For bots
                        let weaIndex = Math.floor(Math.random() * simpleWeapon.length);
                        let selectedWeapon = simpleWeapon[weaIndex]

                        let weaponCat
                        if (selectedWeapon == "basicStick" || selectedWeapon == "simpleSword"){
                            weaponCat = "Sw";
                        } else if (selectedWeapon == "simpleStaff" ){
                            weaponCat = "St";
                        } else if (selectedWeapon == "simpleGun" ){
                            weaponCat = "Gu";
                        } else if (selectedWeapon == "simpleKillers" ){
                            weaponCat = "Ds";
                        }

                        game["Players"][`player${i}`] = {
                            username: `gamebot${i}`,
                            type:"bot",
                            master:"no",
                            hp:0,
                            maxhp:100,
                            posx: posX,
                            posy: posY,
                            status: "I",
                            aGrade: armorGrade,
                            aName: selectedArmor,
                            wCat: weaponCat,
                            wGrade: "s",
                            wName: selectedWeapon,
                            efs: {}
                        };
                        //console.log(`Agregando bot en ${variation}`);
                        //console.log(game);
                        botAdded = true;
                        break;
                    }                  
                  
                }
              }
          
              if (isGameFull(game)) {
                console.log(`Cambiando estado del juego a "playing" en ${variation}`);
                game.status = "playing";

                // Bots names
                // Create a copy of the original array
                let copy = reservedNames.slice();

                // Shuffle the copy array
                copy.sort(() => Math.random() - 0.5);

                // Get the first 10 elements of the shuffled array
                let randomNames = copy.slice(0, 10);

                // Crear "limitTime" key con el timestamp para terminar el juego agrega 665 que son 11 minutos y 5 segundos
                const limitTime = Math.floor(Date.now() / 1000) + 665;
                game.limitTime = limitTime;

                let totalWeaLevel = game["acuWeaponLevel"]
                let totalArmLevel = game["acuArmorLevel"]
                let totalAcuHp = game["acuHp"]
                let playerNumber = game["humanQtn"]
                let botWeaLevel = parseInt(totalWeaLevel/playerNumber)
                let botArmLevel = parseInt(totalArmLevel/playerNumber)
                let botTotalHp = parseInt(totalAcuHp/playerNumber)
                
                //console.log("Total armor levels: ", totalArmLevel)
                //console.log("Human players: ", playerNumber)
                //console.log("Bot armor level: ", botArmLevel) 
                let nameIndex = 0;

                // Add accumulative stats to bots
                for (let player in game["Players"]){                

                    if (game["Players"][player].type == "bot"){
                        
                        game["Players"][player].wLevel = botWeaLevel
                        game["Players"][player].aLevel = botArmLevel
                        game["Players"][player].maxhp = botTotalHp
                        game["Players"][player].hp = botTotalHp
                        game["Players"][player].username = randomNames[nameIndex]
                        nameIndex += 1;
                    }
                    
                }  

                console.log(`El juego en ${variation} terminará en ${new Date(limitTime * 1000)}`);
              } else if (!botAdded) {
                console.log(`Esperando a que se agregue un bot en ${variation}`);
              }
            }    
            
            
          
        }
      }
    }
  }
  
  setInterval(addBotsToWaitingGames, 1000); //cada segundo, pero por el contador cada 2 segundos se agregará un bot
  
