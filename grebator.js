const pg = require("pg");
const fs = require("fs");

const vticnica_ip = "http://192.168.1.42/rpc/Shelly.GetStatus";
const api_link = 'https://api-drzavno-test.scv.si/api/tarifa';



class zdruzeni_podatki {
    constructor(vticnica_json, tarifa_json) {

        this.stanje = vticnica_json['switch:0'].output;
        this.napetost = vticnica_json['switch:0'].voltage;
        this.frekvenca = vticnica_json['switch:0'].freq;
        this.tok = vticnica_json['switch:0'].current;
        this.moc = vticnica_json['switch:0'].apower;
        this.casovni_zig = new Date().toISOString();
        this.tarifa = tarifa_json.tarifa;
        this.valuta = tarifa_json.valuta;
        this.casovni_blok = tarifa_json.casovni_blok;

    }
    izpisi() {
        console.log("-------------------------------------------------------------------------------------------");
        console.log("stanje | napetost | frekvenca | tok | moc |  casovni_zig   | tarifa | valuta | casovni_blok");
        console.log("-------+----------+-----------+-----+-----+----------------+--------+--------+-------------");
        console.log(this.stanje.toString().padStart(6) + " | " +
            this.napetost.toString().padStart(8) + " | " +
            this.frekvenca.toString().padStart(9) + " | " +
            this.tok.toString().padStart(3) + " | " +
            this.moc.toString().padStart(3) + " | " +
            this.casovni_zig.toString().padStart(14) + " | " +
            this.tarifa.toString().padStart(6) + " | " +
            this.valuta.toString().padStart(6) + " | " +
            this.casovni_blok.toString().padStart(12));
        console.log("-------------------------------------------------------------------------------------------");
    }
    async vpisi_v_pb(odjemalec) {
        const poizvedba = `
        INSERT INTO stanje_vticnice (stanje, napetost, frekvenca, tok, moc, casovni_zig, tarifa, valuta, casovni_blok)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
        const vrednosti = [
            this.stanje,
            this.napetost,
            this.frekvenca,
            this.tok,
            this.moc,
            this.casovni_zig,
            this.tarifa,
            this.valuta,
            this.casovni_blok
        ];

        const rezultat = await odjemalec.query(poizvedba, vrednosti);
    }
}

async function dobi_json_iz_povezave(povezava) {
    try {
        const odgovor = await fetch(povezava);
        if (!odgovor.ok) {
            throw new Error(`Napaka: ${odgovor.status}`);
        }
        const podatki = await odgovor.json();
        return podatki;
    } catch (error) {
        console.error("Napaka pri pridobivanju podatkov:", error);
    }
}

const pg_odjemalec = new pg.Client({
    "user": "vticnica_up",
    "password": "vticnica-123",
    "host": "127.0.0.1",
    "port": 5432,
    "database": "vticnica",
});
pg_odjemalec.connect().then(() => console.log("Povezava je uspela!")).catch(err => { console.error("Povezava ni uspela", err); process.exit(); });

(async () => {
    const vticnica_json = await dobi_json_iz_povezave(vticnica_ip);
    const tarifa_json = await dobi_json_iz_povezave(api_link);
    const podatki = new zdruzeni_podatki(vticnica_json, tarifa_json);
    podatki.izpisi();
    podatki.vpisi_v_pb(pg_odjemalec);
})();
