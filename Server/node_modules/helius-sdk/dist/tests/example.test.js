"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const axios_1 = __importDefault(require("axios"));
// Mock axios directly
jest.mock('axios');
const mockedAxios = axios_1.default;
describe("Helius SDK Tests", () => {
    let helius;
    const apiKey = "fake-api-key";
    beforeEach(() => {
        // Initialize the SDK instance
        helius = new src_1.Helius(apiKey, "mainnet-beta");
    });
    it("Should fetch all webhooks correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup the mock response
        const mockWebhooks = { data: [
                { id: "1", name: "Webhook 1" },
                { id: "2", name: "Webhook 2" },
            ] };
        // Mock axios.get to resolve with the mock webhooks
        mockedAxios.get.mockResolvedValueOnce(mockWebhooks);
        // Call the function
        const webhooks = yield helius.getAllWebhooks();
        // Validate
        expect(mockedAxios.get).toHaveBeenCalledWith(`${helius.getApiEndpoint("/v0/webhooks")}`);
        expect(webhooks).toEqual(mockWebhooks.data);
    }));
    it("Should handle errors when fetching all webhooks", () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulate axios.get promise rejection
        const error = new Error('Network error');
        mockedAxios.get.mockRejectedValueOnce(error);
        // Expect the getAllWebhooks method to throw
        yield expect(helius.getAllWebhooks()).rejects.toThrow('Network error');
    }));
});
