CREATE TABLE "LOCATION_DETAILS"
(
    "UID" integer NOT NULL,
    "COUNTRY" "char",
    "STATE" "char",
    "COUNTY" "char",
    "LATITUDE" double precision,
    "LONGITUDE" double precision,
    CONSTRAINT "LOCATION_DETAILS_pkey" PRIMARY KEY ("UID")
)
;

CREATE TABLE "LOCATION_STATS"
(
    "UID" integer NOT NULL,
    "KEY" "char" NOT NULL,
    "STAT_DATE" date NOT NULL,
    "VALUE" integer,
    CONSTRAINT "LOCATION_STATS_pkey" PRIMARY KEY ("UID", "KEY", "STAT_DATE")
)
;
