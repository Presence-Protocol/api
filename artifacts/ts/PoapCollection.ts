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
import { default as PoapCollectionContractJson } from "../PoapCollection.ral.json";
import { getContractByCodeHash, registerContract } from "./contracts";
import { Trait, AllStructs } from "./types";

// Custom types for the contract
export namespace PoapCollectionTypes {
  export type Fields = {
    factoryContractId: HexString;
    nftTemplateId: HexString;
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
    organizer: Address;
    location: HexString;
    eventStartAt: bigint;
    eventEndAt: bigint;
    isPublic: boolean;
    isBurnable: boolean;
    amountForStorageFees: bigint;
    amountPoapFees: bigint;
    totalSupply: bigint;
    amountAirdrop: bigint;
  };

  export type State = ContractState<Fields>;

  export type PoapMintedEvent = ContractEvent<{
    contractId: HexString;
    nftIndex: bigint;
    caller: Address;
    timestamp: bigint;
  }>;
  export type PoapParticipatedEvent = ContractEvent<{
    organizerAddress: Address;
    nftIndex: bigint;
    presenceAddressValidate: Address;
  }>;

  export interface CallMethodTable {
    getCollectionUri: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    totalSupply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    nftByIndex: {
      params: CallContractParams<{ index: bigint }>;
      result: CallContractResult<HexString>;
    };
    validateNFT: {
      params: CallContractParams<{ nftId: HexString; nftIndex: bigint }>;
      result: CallContractResult<null>;
    };
    convert: {
      params: CallContractParams<{ array: HexString }>;
      result: CallContractResult<HexString>;
    };
    mint: {
      params: CallContractParams<{ callerAddr: Address }>;
      result: CallContractResult<HexString>;
    };
    setParticipatedPresence: {
      params: CallContractParams<{
        callerAddr: Address;
        nftIndex: bigint;
        presenceAddressValidate: Address;
      }>;
      result: CallContractResult<null>;
    };
    nftByAddress: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<HexString>;
    };
    getIsPublic: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    getAmountForStorageFees: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    claimFunds: {
      params: CallContractParams<{ amountToClaim: bigint }>;
      result: CallContractResult<null>;
    };
    getPoapPrice: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[bigint, HexString]>;
    };
    getOrganizer: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
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
    getCollectionUri: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    totalSupply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    nftByIndex: {
      params: SignExecuteContractMethodParams<{ index: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    validateNFT: {
      params: SignExecuteContractMethodParams<{
        nftId: HexString;
        nftIndex: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    convert: {
      params: SignExecuteContractMethodParams<{ array: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    mint: {
      params: SignExecuteContractMethodParams<{ callerAddr: Address }>;
      result: SignExecuteScriptTxResult;
    };
    setParticipatedPresence: {
      params: SignExecuteContractMethodParams<{
        callerAddr: Address;
        nftIndex: bigint;
        presenceAddressValidate: Address;
      }>;
      result: SignExecuteScriptTxResult;
    };
    nftByAddress: {
      params: SignExecuteContractMethodParams<{ caller: Address }>;
      result: SignExecuteScriptTxResult;
    };
    getIsPublic: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getAmountForStorageFees: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    claimFunds: {
      params: SignExecuteContractMethodParams<{ amountToClaim: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    getPoapPrice: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getOrganizer: {
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
  PoapCollectionInstance,
  PoapCollectionTypes.Fields
> {
  encodeFields(fields: PoapCollectionTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  eventIndex = { PoapMinted: 0, PoapParticipated: 1 };

  at(address: string): PoapCollectionInstance {
    return new PoapCollectionInstance(address);
  }

  tests = {
    getCollectionUri: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(
        this,
        "getCollectionUri",
        params,
        getContractByCodeHash
      );
    },
    totalSupply: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "totalSupply", params, getContractByCodeHash);
    },
    nftByIndex: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { index: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "nftByIndex", params, getContractByCodeHash);
    },
    validateNFT: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { nftId: HexString; nftIndex: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "validateNFT", params, getContractByCodeHash);
    },
    convert: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { array: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "convert", params, getContractByCodeHash);
    },
    mint: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { callerAddr: Address }
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "mint", params, getContractByCodeHash);
    },
    setParticipatedPresence: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        {
          callerAddr: Address;
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
    nftByAddress: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "nftByAddress", params, getContractByCodeHash);
    },
    getIsPublic: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<boolean>> => {
      return testMethod(this, "getIsPublic", params, getContractByCodeHash);
    },
    getAmountForStorageFees: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getAmountForStorageFees",
        params,
        getContractByCodeHash
      );
    },
    claimFunds: async (
      params: TestContractParamsWithoutMaps<
        PoapCollectionTypes.Fields,
        { amountToClaim: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "claimFunds", params, getContractByCodeHash);
    },
    getPoapPrice: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<[bigint, HexString]>> => {
      return testMethod(this, "getPoapPrice", params, getContractByCodeHash);
    },
    getOrganizer: async (
      params: Omit<
        TestContractParamsWithoutMaps<PoapCollectionTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getOrganizer", params, getContractByCodeHash);
    },
  };

  stateForTest(
    initFields: PoapCollectionTypes.Fields,
    asset?: Asset,
    address?: string
  ) {
    return this.stateForTest_(initFields, asset, address, undefined);
  }
}

// Use this object to test and deploy the contract
export const PoapCollection = new Factory(
  Contract.fromJson(
    PoapCollectionContractJson,
    "",
    "1856d95ed8d7b917d510e5b5ebd1312d3492ecd6edb3d39310ff910fcb0c0edf",
    AllStructs
  )
);
registerContract(PoapCollection);

// Use this class to interact with the blockchain
export class PoapCollectionInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<PoapCollectionTypes.State> {
    return fetchContractState(PoapCollection, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribePoapMintedEvent(
    options: EventSubscribeOptions<PoapCollectionTypes.PoapMintedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PoapCollection.contract,
      this,
      options,
      "PoapMinted",
      fromCount
    );
  }

  subscribePoapParticipatedEvent(
    options: EventSubscribeOptions<PoapCollectionTypes.PoapParticipatedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      PoapCollection.contract,
      this,
      options,
      "PoapParticipated",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | PoapCollectionTypes.PoapMintedEvent
      | PoapCollectionTypes.PoapParticipatedEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      PoapCollection.contract,
      this,
      options,
      fromCount
    );
  }

  view = {
    getCollectionUri: async (
      params?: PoapCollectionTypes.CallMethodParams<"getCollectionUri">
    ): Promise<PoapCollectionTypes.CallMethodResult<"getCollectionUri">> => {
      return callMethod(
        PoapCollection,
        this,
        "getCollectionUri",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    totalSupply: async (
      params?: PoapCollectionTypes.CallMethodParams<"totalSupply">
    ): Promise<PoapCollectionTypes.CallMethodResult<"totalSupply">> => {
      return callMethod(
        PoapCollection,
        this,
        "totalSupply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    nftByIndex: async (
      params: PoapCollectionTypes.CallMethodParams<"nftByIndex">
    ): Promise<PoapCollectionTypes.CallMethodResult<"nftByIndex">> => {
      return callMethod(
        PoapCollection,
        this,
        "nftByIndex",
        params,
        getContractByCodeHash
      );
    },
    validateNFT: async (
      params: PoapCollectionTypes.CallMethodParams<"validateNFT">
    ): Promise<PoapCollectionTypes.CallMethodResult<"validateNFT">> => {
      return callMethod(
        PoapCollection,
        this,
        "validateNFT",
        params,
        getContractByCodeHash
      );
    },
    convert: async (
      params: PoapCollectionTypes.CallMethodParams<"convert">
    ): Promise<PoapCollectionTypes.CallMethodResult<"convert">> => {
      return callMethod(
        PoapCollection,
        this,
        "convert",
        params,
        getContractByCodeHash
      );
    },
    mint: async (
      params: PoapCollectionTypes.CallMethodParams<"mint">
    ): Promise<PoapCollectionTypes.CallMethodResult<"mint">> => {
      return callMethod(
        PoapCollection,
        this,
        "mint",
        params,
        getContractByCodeHash
      );
    },
    setParticipatedPresence: async (
      params: PoapCollectionTypes.CallMethodParams<"setParticipatedPresence">
    ): Promise<
      PoapCollectionTypes.CallMethodResult<"setParticipatedPresence">
    > => {
      return callMethod(
        PoapCollection,
        this,
        "setParticipatedPresence",
        params,
        getContractByCodeHash
      );
    },
    nftByAddress: async (
      params: PoapCollectionTypes.CallMethodParams<"nftByAddress">
    ): Promise<PoapCollectionTypes.CallMethodResult<"nftByAddress">> => {
      return callMethod(
        PoapCollection,
        this,
        "nftByAddress",
        params,
        getContractByCodeHash
      );
    },
    getIsPublic: async (
      params?: PoapCollectionTypes.CallMethodParams<"getIsPublic">
    ): Promise<PoapCollectionTypes.CallMethodResult<"getIsPublic">> => {
      return callMethod(
        PoapCollection,
        this,
        "getIsPublic",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAmountForStorageFees: async (
      params?: PoapCollectionTypes.CallMethodParams<"getAmountForStorageFees">
    ): Promise<
      PoapCollectionTypes.CallMethodResult<"getAmountForStorageFees">
    > => {
      return callMethod(
        PoapCollection,
        this,
        "getAmountForStorageFees",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    claimFunds: async (
      params: PoapCollectionTypes.CallMethodParams<"claimFunds">
    ): Promise<PoapCollectionTypes.CallMethodResult<"claimFunds">> => {
      return callMethod(
        PoapCollection,
        this,
        "claimFunds",
        params,
        getContractByCodeHash
      );
    },
    getPoapPrice: async (
      params?: PoapCollectionTypes.CallMethodParams<"getPoapPrice">
    ): Promise<PoapCollectionTypes.CallMethodResult<"getPoapPrice">> => {
      return callMethod(
        PoapCollection,
        this,
        "getPoapPrice",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getOrganizer: async (
      params?: PoapCollectionTypes.CallMethodParams<"getOrganizer">
    ): Promise<PoapCollectionTypes.CallMethodResult<"getOrganizer">> => {
      return callMethod(
        PoapCollection,
        this,
        "getOrganizer",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    getCollectionUri: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"getCollectionUri">
    ): Promise<
      PoapCollectionTypes.SignExecuteMethodResult<"getCollectionUri">
    > => {
      return signExecuteMethod(
        PoapCollection,
        this,
        "getCollectionUri",
        params
      );
    },
    totalSupply: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"totalSupply">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"totalSupply">> => {
      return signExecuteMethod(PoapCollection, this, "totalSupply", params);
    },
    nftByIndex: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"nftByIndex">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"nftByIndex">> => {
      return signExecuteMethod(PoapCollection, this, "nftByIndex", params);
    },
    validateNFT: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"validateNFT">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"validateNFT">> => {
      return signExecuteMethod(PoapCollection, this, "validateNFT", params);
    },
    convert: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"convert">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"convert">> => {
      return signExecuteMethod(PoapCollection, this, "convert", params);
    },
    mint: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"mint">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"mint">> => {
      return signExecuteMethod(PoapCollection, this, "mint", params);
    },
    setParticipatedPresence: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"setParticipatedPresence">
    ): Promise<
      PoapCollectionTypes.SignExecuteMethodResult<"setParticipatedPresence">
    > => {
      return signExecuteMethod(
        PoapCollection,
        this,
        "setParticipatedPresence",
        params
      );
    },
    nftByAddress: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"nftByAddress">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"nftByAddress">> => {
      return signExecuteMethod(PoapCollection, this, "nftByAddress", params);
    },
    getIsPublic: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"getIsPublic">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"getIsPublic">> => {
      return signExecuteMethod(PoapCollection, this, "getIsPublic", params);
    },
    getAmountForStorageFees: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"getAmountForStorageFees">
    ): Promise<
      PoapCollectionTypes.SignExecuteMethodResult<"getAmountForStorageFees">
    > => {
      return signExecuteMethod(
        PoapCollection,
        this,
        "getAmountForStorageFees",
        params
      );
    },
    claimFunds: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"claimFunds">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"claimFunds">> => {
      return signExecuteMethod(PoapCollection, this, "claimFunds", params);
    },
    getPoapPrice: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"getPoapPrice">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"getPoapPrice">> => {
      return signExecuteMethod(PoapCollection, this, "getPoapPrice", params);
    },
    getOrganizer: async (
      params: PoapCollectionTypes.SignExecuteMethodParams<"getOrganizer">
    ): Promise<PoapCollectionTypes.SignExecuteMethodResult<"getOrganizer">> => {
      return signExecuteMethod(PoapCollection, this, "getOrganizer", params);
    },
  };

  async multicall<Calls extends PoapCollectionTypes.MultiCallParams>(
    calls: Calls
  ): Promise<PoapCollectionTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends PoapCollectionTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<PoapCollectionTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends
      | PoapCollectionTypes.MultiCallParams
      | PoapCollectionTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(
      PoapCollection,
      this,
      callss,
      getContractByCodeHash
    );
  }
}
