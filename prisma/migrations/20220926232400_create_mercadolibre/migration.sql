-- CreateTable
CREATE TABLE "MercadoLibre" (
    "mercadolibre_id" SERIAL NOT NULL,
    "app_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,

    CONSTRAINT "MercadoLibre_pkey" PRIMARY KEY ("mercadolibre_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MercadoLibre_app_id_key" ON "MercadoLibre"("app_id");
