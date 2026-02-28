"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionRepository = void 0;
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("./firestore");
const FieldValue = admin.firestore.FieldValue;
const VERSIONS_COLLECTION = 'versions';
exports.VersionRepository = {
    /**
     * Inserts a new Version document (immutable pattern: never update existing
     * assets or prompt text; only append new versions).
     */
    async insertVersion(version) {
        const ref = await firestore_1.db.collection(VERSIONS_COLLECTION).add({
            ...version,
            createdAt: FieldValue.serverTimestamp()
        });
        return ref.id;
    },
    /**
     * Updates only the status and metadata of an existing Version (e.g. IMAGE_READY
     * with imageUrl). Does not overwrite prompt or asset content per immutable constraints.
     */
    async updateVersionStatus(versionId, status, metadata) {
        const ref = firestore_1.db.collection(VERSIONS_COLLECTION).doc(versionId);
        await ref.update({
            status,
            ...metadata,
            updatedAt: FieldValue.serverTimestamp()
        });
    }
};
