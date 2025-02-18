/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  Asset,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
  Narrow,
} from "@alephium/web3";
import { default as PoapFactoryContractJson } from "../PoapFactory.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import { Trait, AllStructs } from "./types";

// Custom types for the contract
export namespace PoapFactoryTypes {
  export type Fields = {
    collectionTemplateId: HexString;
    poapTemplateId: HexString;
    numMintedCollection: bigint;
  };

  export type State = ContractState<Fields>;

  export type EventCreatedEvent = ContractEvent<{
    contractId: HexString;
    eventName: HexString;
    organizer: Address;
    isPublic: boolean;
    timestamp: bigint;
  }>;
  export type PoapMintedEvent = ContractEvent<{
    contractId: HexString;
    collectionId: HexString;
    nftIndex: bigint;
    caller: Address;
    isPublic: boolean;
    timestamp: bigint;
  }>;
  export type PoapParticipatedInEvent = ContractEvent<{
    organizerAddress: Address;
    collectionId: HexString;
    nftIndex: bigint;
    presenceAddressValidate: Address;
  }>;

  export interface CallMethodTable {
    mintNewCollection: {
      params: CallContractParams<{
        maxSupply: bigint;
        mintStartAt: bigint;
        mintEndAt: bigint;
        oneMintPerAddress: boolean;
        poapPrice: bigint;
        tokenIdPoap: HexString;
        tokenIdAirdrop: HexString;
        amountAirdropPerUser: bigint;
        eventImage: HexString;
        eventName: HexString;
        description: HexString;
        location: HexString;
        eventStartAt: bigint;
        eventEndAt: bigint;
        isPublic: boolean;
        isBurnable: boolean;
        amountForStorageFees: bigint;
        amountPoapFees: bigint;
        totalSupply: bigint;
        amountAirdrop: bigint;
      }>;
      result: CallContractResult<HexString>;
    };
    mintPoap: {
      params: CallContractParams<{ collection: HexString }>;
      result: CallContractResult<null>;
    };
    setParticipatedPresence: {
      params: CallContractParams<{
        collection: HexString;
        nftIndex: bigint;
        presenceAddressValidate: Address;
      }>;
      result: CallContractResult<null>;
    };
    getNumEventsCreated: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
  export type MulticallReturnType<Callss extends MultiCallParams[]> = {
    [index in keyof Callss]: MultiCallResults<Callss[index]>;
  };

  export interface SignExecuteMethodTable {
    mintNewCollection: {
      params: SignExecuteContractMethodParams<{
        maxSupply: bigint;
        mintStartAt: bigint;
        mintEndAt: bigint;
        oneMintPerAddress: boolean;
        poapPrice: bigint;
        tokenIdPoap: HexString;
        tokenIdAirdrop: HexString;
        amountAirdropPerUser: bigint;
        eventImage: HexString;
        eventName: HexString;
        description: HexString;
        location: HexString;
        eventStartAt: bigint;
        eventEndAt: bigint;
        isPublic: boolean;
        isBurnable: boolean;
        amountForStorageFees: bigint;
        amountPoapFees: bigint;
        totalSupply: bigint;
        amountAirdrop: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    mintPoap: {
      params: SignExecuteContractMethodParams<{ collection: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    setParticipatedPresence: {
      params: SignExecuteContractMethodParams<{
        collection: HexString;
        nftIndex: bigint;
        presenceAddressValidate: Address;
      }>;
      result: SignExecuteScriptTxResult;
    };
    getNumEventsCreated: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<
  PoapFactoryInstance,
  PoapFactoryTypes.Fields
> {
  encodeFields(fields: PoapFactoryTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  eventIndex = { EventCreated: 0, PoapMinted: 1, PoapParticipatedIn: 2 };

  at(address: string): PoapFactoryInstance {
    return new PoapFactoryInstance(address);
  }

  tests = {
    mintNewCollection: async (
      params: TestContractParamsWithoutMaps<
        PoapFactoryTypes.Fields,
        {
          maxSupply: bigint;
          mintStartAt: bigint;
          mintEndAt: bigint;
          oneMintPerAddress: boolean;
          poapPrice: bigint;
          tokenIdPoap: HexString;
          tokenIdAirdrop: HexString;
          amountAirdropPerUser: bigint;
          eventImage: HexString;
          eventName: HexString;
          description: HexString;
          location: HexString;
          eventStartAt: bigint;
          eventEndAt: bigint;
          isPublic: boolean;
          isBurnable: boolean;
          amountForStorageFees: bigint;
          amountPoapFees: bigint;
          totalSupply: bigint;
          amountAirdrop: bigint;
        }
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(
        this,
        "mintNewCollection",
        params,
        getContractByCodeHash
      );
    },
    mintPoap: async (
      params: TestContractParamsWithoutMaps<
        PoapFactoryTypes.Fields,
        { collection: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "mintPoap", params, getContractByCodeHash);
    },
    setParticipatedPresence: async (
      params: TestContractParamsWithoutMaps<
        PoapFactoryTypes.Fields,
        {
          collection: HexString;
          nftIndex: bigint;
          presenceAddressValidate: Address;
        }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "setParticipatedPresence",
        params,
        getContractByCodeHash
      );
    },
    getNumEventsCreated: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapFactoryTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getNumEventsCreated",
        params,
        getContractByCodeHash
      );
    },
  };

  stateForTest(
    initFields: PoapFactoryTypes.Fields,
    asset?: Asset,
    address?: string
  ) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const PoapFactory = new Factory(
  Contract.fromJson(
    PoapFactoryContractJson,
    "",
    "258dd01727a87207573a12e33d66d3b49091da38a0c1b56032828a62cec70414",
    AllStructs
  )
);
registerContract(PoapFactory);

// Use this class to interact with the blockchain
export class PoapFactoryInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<PoapFactoryTypes.State> {
    return fetchContractState(PoapFactory, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeEventCreatedEvent(
    options: EventSubscribeOptions<PoapFactoryTypes.EventCreatedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PoapFactory.contract,
      this,
      options,
      "EventCreated",
      fromCount
    );
  }

  subscribePoapMintedEvent(
    options: EventSubscribeOptions<PoapFactoryTypes.PoapMintedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PoapFactory.contract,
      this,
      options,
      "PoapMinted",
      fromCount
    );
  }

  subscribePoapParticipatedInEvent(
    options: EventSubscribeOptions<PoapFactoryTypes.PoapParticipatedInEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PoapFactory.contract,
      this,
      options,
      "PoapParticipatedIn",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | PoapFactoryTypes.EventCreatedEvent
      | PoapFactoryTypes.PoapMintedEvent
      | PoapFactoryTypes.PoapParticipatedInEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      PoapFactory.contract,
      this,
      options,
      fromCount
    );
  }

  view = {
    mintNewCollection: async (
      params: PoapFactoryTypes.CallMethodParams<"mintNewCollection">
    ): Promise<PoapFactoryTypes.CallMethodResult<"mintNewCollection">> => {
      return callMethod(
        PoapFactory,
        this,
        "mintNewCollection",
        params,
        getContractByCodeHash
      );
    },
    mintPoap: async (
      params: PoapFactoryTypes.CallMethodParams<"mintPoap">
    ): Promise<PoapFactoryTypes.CallMethodResult<"mintPoap">> => {
      return callMethod(
        PoapFactory,
        this,
        "mintPoap",
        params,
        getContractByCodeHash
      );
    },
    setParticipatedPresence: async (
      params: PoapFactoryTypes.CallMethodParams<"setParticipatedPresence">
    ): Promise<
      PoapFactoryTypes.CallMethodResult<"setParticipatedPresence">
    > => {
      return callMethod(
        PoapFactory,
        this,
        "setParticipatedPresence",
        params,
        getContractByCodeHash
      );
    },
    getNumEventsCreated: async (
      params?: PoapFactoryTypes.CallMethodParams<"getNumEventsCreated">
    ): Promise<PoapFactoryTypes.CallMethodResult<"getNumEventsCreated">> => {
      return callMethod(
        PoapFactory,
        this,
        "getNumEventsCreated",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    mintNewCollection: async (
      params: PoapFactoryTypes.SignExecuteMethodParams<"mintNewCollection">
    ): Promise<
      PoapFactoryTypes.SignExecuteMethodResult<"mintNewCollection">
    > => {
      return signExecuteMethod(PoapFactory, this, "mintNewCollection", params);
    },
    mintPoap: async (
      params: PoapFactoryTypes.SignExecuteMethodParams<"mintPoap">
    ): Promise<PoapFactoryTypes.SignExecuteMethodResult<"mintPoap">> => {
      return signExecuteMethod(PoapFactory, this, "mintPoap", params);
    },
    setParticipatedPresence: async (
      params: PoapFactoryTypes.SignExecuteMethodParams<"setParticipatedPresence">
    ): Promise<
      PoapFactoryTypes.SignExecuteMethodResult<"setParticipatedPresence">
    > => {
      return signExecuteMethod(
        PoapFactory,
        this,
        "setParticipatedPresence",
        params
      );
    },
    getNumEventsCreated: async (
      params: PoapFactoryTypes.SignExecuteMethodParams<"getNumEventsCreated">
    ): Promise<
      PoapFactoryTypes.SignExecuteMethodResult<"getNumEventsCreated">
    > => {
      return signExecuteMethod(
        PoapFactory,
        this,
        "getNumEventsCreated",
        params
      );
    },
  };

  async multicall<Calls extends PoapFactoryTypes.MultiCallParams>(
    calls: Calls
  ): Promise<PoapFactoryTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends PoapFactoryTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<PoapFactoryTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends
      | PoapFactoryTypes.MultiCallParams
      | PoapFactoryTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(
      PoapFactory,
      this,
      callss,
      getContractByCodeHash
    );
  }
}
