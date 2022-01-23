-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "countyId" TEXT NOT NULL,
    "comments" TEXT,
    "submitter" BOOLEAN DEFAULT false,
    "writer" BOOLEAN DEFAULT false,
    "tracker" BOOLEAN DEFAULT false,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "last_writing_request" TEXT,
    "last_sending_request" TEXT,
    "last_amplifying_request" TEXT,
    "submitted" BOOLEAN DEFAULT false,
    "published" BOOLEAN DEFAULT false,
    "volunteerId" TEXT NOT NULL,
    "newspaperId" TEXT[],
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newspaper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "rating" INTEGER,
    "description" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,

    CONSTRAINT "Newspaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(300),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Legislator" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "party" BOOLEAN,

    CONSTRAINT "Legislator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CountyToNewspaper" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CountyToLegislator" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_key" ON "Volunteer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Newspaper_name_key" ON "Newspaper"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToNewspaper_AB_unique" ON "_CountyToNewspaper"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToNewspaper_B_index" ON "_CountyToNewspaper"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountyToLegislator_AB_unique" ON "_CountyToLegislator"("A", "B");

-- CreateIndex
CREATE INDEX "_CountyToLegislator_B_index" ON "_CountyToLegislator"("B");

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_newspaperId_fkey" FOREIGN KEY ("newspaperId") REFERENCES "Newspaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToNewspaper" ADD FOREIGN KEY ("A") REFERENCES "County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToNewspaper" ADD FOREIGN KEY ("B") REFERENCES "Newspaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToLegislator" ADD FOREIGN KEY ("A") REFERENCES "County"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountyToLegislator" ADD FOREIGN KEY ("B") REFERENCES "Legislator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
