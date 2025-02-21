CREATE DATABASE vticnica;
\c vticnica
CREATE TABLE stanje_vticnice(
    id_zapisa SERIAL PRIMARY KEY,
    stanje BOOLEAN NOT NULL,
    napetost NUMERIC(10,5) NOT NULL,
    frekvenca NUMERIC(10,5) NOT NULL,
    tok NUMERIC(10,5) NOT NULL,
    moc NUMERIC(10,5) NOT NULL,
    casovni_zig TIMESTAMP NOT NULL,
    tarifa NUMERIC(10,5) NOT NULL,
    valuta VARCHAR(40) NOT NULL,
    casovni_blok INT NOT NULL
);
CREATE USER vticnica_up WITH PASSWORD 'vticnica-123';
GRANT ALL PRIVILEGES ON DATABASE vticnica TO vticnica_up;
