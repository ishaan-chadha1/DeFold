import { task } from 'hardhat/config';
// import { ethers } from 'hardhat';

task("deploy", "Deploy the DeFold contract")
  .setAction(async (taskArgs, hre) => {
    const deFold = await hre.ethers.deployContract("DeFold");
    await deFold.waitForDeployment();
    console.log(`DeFold contract deployed to: ${deFold.target}`);

    // Add mock genomic data
    const mockData = [
      {
        name: "Researcher1",
        chromosome: "11",
        gene: "Insulin (INS)",
        organism: "Homo sapiens",
        nucleotideRange: "1000-2000",
        assemblyType: "GRCh38.p14",
        accession: "AC123456",
        sequence: "ATGCGTACGTAGCTAGCTAGC",
        title: "BRCA1 Gene Data",
        price: ethers.parseEther("0.05"),
      },
      {
        name: "Researcher2",
        chromosome: "2",
        gene: "TP53",
        organism: "Homo sapiens",
        nucleotideRange: "1500-2500",
        assemblyType: "GRCh38",
        accession: "AC654321",
        sequence: "CGTACGTAGCTAGCTAGCTAG",
        title: "TP53 Gene Data",
        price: ethers.parseEther("0.07"),
      },
      {
        name: "Researcher3",
        chromosome: "3",
        gene: "EGFR",
        organism: "Homo sapiens",
        nucleotideRange: "2000-3000",
        assemblyType: "GRCh38",
        accession: "AC789012",
        sequence: "TACGTAGCTAGCTAGCTAGC",
        title: "EGFR Gene Data",
        price: ethers.parseEther("0.03"),
      },
    ];

    for (const data of mockData) {
      const tx = await deFold.submitGenomicData(
        data.name,
        data.chromosome,
        data.gene,
        data.organism,
        data.nucleotideRange,
        data.assemblyType,
        data.accession,
        data.sequence,
        data.title,
        data.price
      );
      await tx.wait();
      console.log(`Mock genomic data submitted: ${data.title}`);
    }
  });

// Task to submit genomic data
task("submit-genomic-data", "Submit genomic data to the contract")
  .addPositionalParam("contractAddress", "The deployed contract address")
  .addPositionalParam("name", "Researcher's name")
  .addPositionalParam("chromosome", "Chromosome information")
  .addPositionalParam("gene", "Gene information")
  .addPositionalParam("organism", "Organism name")
  .addPositionalParam("nucleotideRange", "Nucleotide range")
  .addPositionalParam("assemblyType", "Assembly type")
  .addPositionalParam("accession", "Accession number")
  .addPositionalParam("sequence", "Genomic sequence")
  .addPositionalParam("title", "Title of the data")
  .addPositionalParam("price", "Price in wei")
  .setAction(async ({
      contractAddress,
      name,
      chromosome,
      gene,
      organism,
      nucleotideRange,
      assemblyType,
      accession,
      sequence,
      title,
      price
    }, { ethers }) => {
      const deFold = await ethers.getContractAt("DeFold", contractAddress);

      const tx = await deFold.submitGenomicData(
        name,
        chromosome,
        gene,
        organism,
        nucleotideRange,
        assemblyType,
        accession,
        sequence,
        title,
        price
      );
      await tx.wait();

      console.log(`Submitted genomic data with title: ${title}`);
  });

// Task to purchase genomic data
task("purchase-genomic-data", "Purchase genomic data from the contract")
  .addPositionalParam("contractAddress", "The deployed contract address")
  .addPositionalParam("dataId", "The ID of the genomic data to purchase")
  .addPositionalParam("payment", "Payment in wei")
  .setAction(async ({ contractAddress, dataId, payment }, { ethers }) => {
    const deFold = await ethers.getContractAt("DeFold", contractAddress);

    const tx = await deFold.purchaseGenomicData(dataId, { value: payment });
    await tx.wait();

    console.log(`Purchased genomic data with ID: ${dataId}`);
  });

// Task to get nucleotide counts
task("get-nucleotide-counts", "Get nucleotide counts for purchased genomic data")
  .addPositionalParam("contractAddress", "The deployed contract address")
  .addPositionalParam("dataId", "The ID of the genomic data")
  .setAction(async ({ contractAddress, dataId }, { ethers }) => {
    const deFold = await ethers.getContractAt("DeFold", contractAddress);

    const counts = await deFold.getNucleotideCounts(dataId);
    console.log(`Nucleotide counts for data ID ${dataId}: A=${counts[0]}, C=${counts[1]}, T=${counts[2]}, G=${counts[3]}`);
  });

// Task to get researcher rating
task("get-researcher-rating", "Get the average rating of a researcher")
  .addPositionalParam("contractAddress", "The deployed contract address")
  .addPositionalParam("researcher", "The address of the researcher")
  .setAction(async ({ contractAddress, researcher }, { ethers }) => {
    const deFold = await ethers.getContractAt("DeFold", contractAddress);

    const averageRating = await deFold.getResearcherRating(researcher);
    console.log(`Average rating for researcher ${researcher}: ${averageRating}`);
  });

// Task to get genomic data info
task("get-genomic-data-info", "Get information about genomic data")
  .addPositionalParam("contractAddress", "The deployed contract address")
  .addPositionalParam("dataId", "The ID of the genomic data")
  .setAction(async ({ contractAddress, dataId }, { ethers }) => {
    const deFold = await ethers.getContractAt("DeFold", contractAddress);

    const info = await deFold.getGenomicDataInfo(dataId);
    console.log(`Genomic Data Info for ID ${dataId}: Title=${info.title}, Price=${info.price}, Owner=${info.owner}, Organism=${info.organism}, Nucleotide Range=${info.nucleotideRange}, Gene=${info.gene}, Average Rating=${info.ownerRating}`);
  });

  // Task to get all genomic data
task("get-all-genomic-data", "Get all genomic data")
.addPositionalParam("contractAddress", "The deployed contract address")
.setAction(async ({ contractAddress }, { ethers }) => {
  const deFold = await ethers.getContractAt("DeFold", contractAddress);

  const totalDataCount = await deFold.genomicDataCounter();
  console.log(`Total genomic data entries: ${totalDataCount.toString()}`);

  for (let i = 1; i <= totalDataCount; i++) {
    const genomicData = await deFold.genomicDataRegistry(i);
    console.log(`Genomic Data ID ${i}:`);
    console.log(`  Chromosome: ${genomicData.chromosome}`);
    console.log(`  Gene: ${genomicData.gene}`);
    console.log(`  Organism: ${genomicData.organism}`);
    console.log(`  Nucleotide Range: ${genomicData.nucleotideRange}`);
    console.log(`  Assembly Type: ${genomicData.assemblyType}`);
    console.log(`  Accession: ${genomicData.accession}`);
    console.log(`  Title: ${genomicData.title}`);
    console.log(`  Price: ${genomicData.price.toString()} wei`);
    console.log(`  Owner: ${genomicData.owner}`);
  }
});