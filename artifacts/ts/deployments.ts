/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  RunScriptResult,
  DeployContractExecutionResult,
  NetworkId,
} from "@alephium/web3";
import {
  PoapNFT,
  PoapNFTInstance,
  PoapCollection,
  PoapCollectionInstance,
  PoapFactory,
  PoapFactoryInstance,
} from ".";
import { default as mainnetDeployments } from "../../deployments/.deployments.mainnet.json";
import { default as testnetDeployments } from "../../deployments/.deployments.testnet.json";
import { default as devnetDeployments } from "../../deployments/.deployments.devnet.json";

export type Deployments = {
  deployerAddress: string;
  contracts: {
    PoapNFT: DeployContractExecutionResult<PoapNFTInstance>;
    PoapCollection: DeployContractExecutionResult<PoapCollectionInstance>;
    PoapFactory: DeployContractExecutionResult<PoapFactoryInstance>;
  };
};

function toDeployments(json: any): Deployments {
  const contracts = {
    PoapNFT: {
      ...json.contracts["PoapNFT"],
      contractInstance: PoapNFT.at(
        json.contracts["PoapNFT"].contractInstance.address
      ),
    },
    PoapCollection: {
      ...json.contracts["PoapCollection"],
      contractInstance: PoapCollection.at(
        json.contracts["PoapCollection"].contractInstance.address
      ),
    },
    PoapFactory: {
      ...json.contracts["PoapFactory"],
      contractInstance: PoapFactory.at(
        json.contracts["PoapFactory"].contractInstance.address
      ),
    },
  };
  return {
    ...json,
    contracts: contracts as Deployments["contracts"],
  };
}

export function loadDeployments(
  networkId: NetworkId,
  deployerAddress?: string
): Deployments {
  const deployments =
    networkId === "mainnet"
      ? mainnetDeployments
      : networkId === "testnet"
      ? testnetDeployments
      : networkId === "devnet"
      ? devnetDeployments
      : undefined;
  if (deployments === undefined) {
    throw Error("The contract has not been deployed to the " + networkId);
  }
  const allDeployments: any[] = Array.isArray(deployments)
    ? deployments
    : [deployments];
  if (deployerAddress === undefined) {
    if (allDeployments.length > 1) {
      throw Error(
        "The contract has been deployed multiple times on " +
          networkId +
          ", please specify the deployer address"
      );
    } else {
      return toDeployments(allDeployments[0]);
    }
  }
  const result = allDeployments.find(
    (d) => d.deployerAddress === deployerAddress
  );
  if (result === undefined) {
    throw Error("The contract deployment result does not exist");
  }
  return toDeployments(result);
}
