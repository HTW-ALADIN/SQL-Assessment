CREATE TABLE ang_pro (
    "PROZ_ARB" integer NOT NULL,
    "PNR" integer NOT NULL,
    "ANGNR" integer NOT NULL
);

CREATE TABLE angest (
    "ANGNR" integer NOT NULL,
    "NAME" character varying(32) NOT NULL,
    "WOHNORT" character varying(32) NOT NULL,
    "BERUF" character varying(32) NOT NULL,
    "GEHALT" integer NOT NULL,
    "ABTNR" integer NOT NULL
);

CREATE TABLE kunde (
    "KDNR" integer NOT NULL,
    "NAME" character varying(32) NOT NULL,
    "WOHNORT" character varying(32) NOT NULL,
    "TAETIG_ALS" character varying(32) NOT NULL
);

CREATE TABLE projekt (
    "PNAME" character varying(32),
    "PNR" integer NOT NULL,
    "P_BESCHR" character varying(1024),
    "P_LEITER" integer NOT NULL
);
