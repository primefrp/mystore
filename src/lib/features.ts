import type { Business, FeatureKey } from "./types";

export function hasFeature(business: Business, feature: FeatureKey) {
  return business.enabledFeatures.includes(feature);
}

export function requireFeature(business: Business, feature: FeatureKey) {
  if (!hasFeature(business, feature)) {
    throw new Error(`${business.name} does not have ${feature} enabled.`);
  }
}

export function visibleFeatures(business: Business, features: FeatureKey[]) {
  return features.filter((feature) => hasFeature(business, feature));
}
