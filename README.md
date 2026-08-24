# Traya — Hair Assessment App

A React Native app that walks a user through a signup, an 11-question hair-loss assessment, and a generated report/plan with a mini product checkout. Built as a linear, mobile-first flow — no dashboard, no tabs, just one thing leading into the next.

This README documents not just *how to run it*, but *why it's built the way it is* — the design system, the architectural calls, and the tradeoffs, for whoever picks this codebase up next.

## Contents

- [Design system](#design-system)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Libraries](#libraries)
- [Notable engineering decisions](#notable-engineering-decisions)
- [Running the project](#running-the-project)
- [Testing](#testing)
- [Known limitations / what's stubbed](#known-limitations--whats-stubbed)

## Design system

### Colors

All color is defined in one place, `src/theme/colors.ts`, and it's deliberately a **monochromatic system built from a single hue**:

```ts
background: '#DCE8D5'   // pale sage
primary:    '#173F35'   // deep forest green
onPrimary:  '#FFFFFF'
```

Every other token — `textMuted`, `placeholder`, `divider`, `overlay` — is not a separately-chosen gray, it's an **alpha variant of `primary`** (`rgba(23, 63, 53, 0.55)`, `0.4`, `0.18`, `0.35`). That's a conscious constraint, not laziness: with only two real hues in the whole app, everything stays tonally coherent by construction — a new component can't introduce a clashing gray, because there's no second gray to reach for.

The sage-and-forest-green palette itself matches the product content, not just aesthetic taste: the report screen sells ayurvedic products (Bhringraj, Amla, Neem — see `src/data/fullReport.ts`), so a herbal, botanical palette is on-brand rather than decorative. It also does real UX work for a sensitive topic: hair loss assessment can read as clinical and anxiety-inducing, and a warm, natural palette (versus sterile white/blue "medical app" styling) keeps the tone reassuring without sacrificing the credibility a health-adjacent product needs.

### Typography

DM Sans, loaded as four **static weight instances** (`DMSans-Regular/Medium/Bold/ExtraBold.ttf`) rather than one variable font — React Native on Android resolves custom fonts by exact PostScript family name, not by `fontWeight` on a variable font, so static instances are the reliable choice cross-platform. `src/theme/typography.ts` exposes a small named type scale (`title`, `body`, `label`, `caption`, `captionEmphasis`, `cta`) that every screen composes from, instead of components picking font sizes ad hoc.

### Icons instead of photography for the questionnaire

Every assessment question that needs imagery (hair texture, parting pattern, density map, etc.) uses a flat, line-drawn icon set instead of stock or commissioned photography. A few reasons this holds up as the right call, not just the cheap one:

- **Selected-state treatment.** `OptionCard` animates a selected option by sweeping a solid-color fill across the card and crossfading the icon to a light-on-dark variant (see `resolveOptionSelectedIcon` / `genderedSelectedIcon`). That crossfade reads cleanly on a simple line icon; it doesn't translate to a photograph.
- **Gendered variants without a photo shoot.** Several questions (parting pattern, density-map month-by-month) show a male or female illustration depending on the gender picked at signup (`resolveIconGender` → `-m`/`-f` asset pairs). Illustrating two clean variants per option is tractable; photographing two full shoots for every option/stage combination is not.
- **Diagnostic clarity over realism.** A parting-width or density diagram needs to communicate a specific, comparable visual pattern ("even" vs "widening" vs "advanced widening"). A line diagram controls for lighting, hair color, and camera angle in a way a photo can't — it's closer to a clinical chart than a lifestyle photo, which is what a hair-loss self-assessment should probably feel like.
- **Tone.** Photos of visible hair loss/balding risk feeling alarming for a user who's already anxious about the topic. Neutral illustrations keep the assessment feeling like a diagnostic tool, not a before/after ad.

## Architecture

### Navigation: a plain state switch, not React Navigation

`src/navigation/RootNavigator.tsx` is a `switch` over a `ScreenName` string held in `useState` — no `react-navigation`, no stack/tab primitives. For an app this size (11 linear screens, no deep links, no nested flows, no back-stack branching), a real navigation library is more machinery than the app needs. Every screen still takes plain callback props (`onContinue`, `onBack`, etc.), so if the app grows into needing real stack navigation, deep links, or native back-gesture handling, the migration is scoped to this one file — screens don't need to change.

The tradeoff this buys: screen transitions have **no shared native transition** (each screen unmounts/mounts fresh), so every screen owns its own entrance animation via `Animated`, and any "feels like a push/pop" moment (see `ProductDetailScreen`'s slide in/out) is hand-built rather than inherited from a navigator. That's more code, but it's explicit code, and it avoids pulling in a stack navigator's memory/gesture overhead for a flow that's fundamentally linear.

### State management: just React

No Redux, Zustand, MobX, or context-based global store. Screen-local state lives in `useState`; the small amount of cross-screen state (current user, selected gender, selected product, full-report scroll position) lives in `RootNavigator` and is threaded down as props. This is a direct consequence of the navigation choice above — with one component owning the whole screen stack, "lift state to the owner" is simpler than introducing a store.

### Data layer: typed, colocated, and clearly fake for now

`src/data/*.ts` holds the assessment question bank, the report/product catalog, and gender-icon resolution — all typed, all static TypeScript rather than JSON, so the compiler catches shape mistakes. `src/services/auth.ts` is an explicitly-labeled local stub (`signUp`/`signIn` resolve immediately with fake data); its comment says outright that swapping in a real backend later means rewriting the function bodies, not touching any screen. That boundary is deliberate — screens depend on the *shape* of `AuthResult`, never on how it's produced.

## Project structure

```
src/
  components/     Reusable, presentation-only UI — Button, TextField, SelectField,
                   OptionCard, CheckboxOptionCard, AgePicker, ScreenContainer, etc.
                   No screen imports another screen's components directly; anything
                   reused lives here.
  screens/         One file per full-screen view. Screens own their local state and
                   entrance animations, and take simple callback props — no screen
                   reaches into navigation state directly.
  navigation/      RootNavigator (the switch-based "router") and its ScreenName type.
  data/            Static, typed content: assessment questions, report/product
                   catalog, gender→icon resolution.
  services/        auth.ts — the stubbed backend boundary.
  theme/           colors.ts, typography.ts — the entire design system in two files.
  types/           Shared TS interfaces (assessment question shapes, user/gender).
  utils/           Pure helper functions (form validation, gendered-icon lookup).
android/           Native Android project (Kotlin, Gradle).
ios/               Native iOS project (Swift, Xcode/CocoaPods).
assets/
  fonts/           DM Sans static weight files.
  images/          Icons (incl. gendered -m/-f pairs), product photography, one GIF.
__tests__/         Jest tests.
App.tsx            Root component: SafeAreaProvider + StatusBar + RootNavigator.
```

A screen file is expected to be self-contained: its own `StyleSheet.create` block at the bottom, its own entrance-animation constants at the top, no shared "screen styles" file. That's a deliberate bias toward locality over DRY for styling — screens in this app diverge in layout often enough that a shared style layer would mostly be indirection.

## Libraries

| Library | Why it's here |
|---|---|
| `react` 19.2 / `react-native` 0.87 | Current stable RN — New Architecture (Fabric) by default, so all touch handling and animations in this app assume Fabric's behavior. |
| `react-native-safe-area-context` | Provides safe-area insets. Used via the `useSafeAreaInsets()` **hook**, deliberately not the `<SafeAreaView>` component — see [Notable engineering decisions](#notable-engineering-decisions). |
| `react-native-linear-gradient` | Powers `OptionCard`'s animated selected-state fill sweep and `AgePicker`'s edge-fade mask. Not used for decorative gradients — only where an actual animated gradient sweep is needed. |
| `react-native`'s built-in `Animated` API | Every entrance/exit animation in the app (`Animated.timing`, `Easing`, native driver) — no Reanimated, no Moti. The app's animations are simple enough (translate/opacity/fill) that the core API is sufficient, and it's one fewer native dependency to keep in sync with New Architecture. |
| TypeScript, ESLint (`@react-native/eslint-config`), Prettier | Standard RN toolchain, unmodified beyond the default config. |
| Jest + `react-test-renderer` | Smoke-level testing (see [Testing](#testing)) — not exercised heavily yet. |

Nothing else. No UI kit, no icon font library (icons are shipped as PNGs, resolved per-option), no state management library, no navigation library, no networking library (there's no backend to call yet).

## Notable engineering decisions

A few fixes made during development are worth understanding, because the "obvious" alternative is what most RN devs would reach for first, and it's wrong here:

- **`useSafeAreaInsets()`, not `<SafeAreaView>`.** `<SafeAreaView>` from `react-native-safe-area-context` v5 is a *native* component — a freshly-mounted instance needs a native layout pass before it knows its inset, so it renders one frame at `padding: 0` before snapping to the correct value. Because this app has no persistent navigator (every screen transition is a full unmount/remount, and the assessment flow remounts its screen per question via `key`), that "flash to zero padding" fired on *every* redirect, reading as a flicker at the top of the screen. Reading `useSafeAreaInsets()` from context and applying the inset as a manual style has no such gap — the value is already resolved on first render. See `ScreenContainer.tsx`, `FullReportScreen.tsx`, `ProductDetailScreen.tsx`.
- **Android's system splash screen needed explicit, *valid* overrides.** Android 12+ always shows its own splash window before JS loads, using the launcher icon by default. Suppressing it isn't as simple as pointing `windowSplashScreenAnimatedIcon` at an empty drawable — a drawable with zero actual path content gets treated as invalid and Android silently falls back to the default icon. The fix (`android/app/src/main/res/drawable/splash_icon_transparent.xml`) is a real, correctly-sized vector with a fully-transparent fill — valid content that happens to render as nothing. Kept in a `values-v31/` resource override, not the base theme, since these attributes only exist from API 31 and some OEM theme parsers don't reliably ignore attributes they don't recognize.
- **Animated GIFs don't animate on Android by default.** `Image` on Android is backed by Fresco, and Fresco's GIF decoder is an opt-in module — without it, only the first frame renders. iOS's `Image` handles GIFs natively, so this only shows up on Android. Fixed by adding `com.facebook.fresco:animated-gif`, version-pinned to match whatever Fresco version `react-android` already resolves (check with `./gradlew :app:dependencies --configuration releaseRuntimeClasspath | grep fresco`) so it reuses the existing Fresco instance instead of pulling in a second one.
- **A `Modal`'s `animationType` animates its whole subtree as one rigid unit.** The gender picker's bottom sheet originally used `animationType="slide"`; since the dimmed backdrop and the sheet were both inside that single translated tree, the backdrop itself visibly slid up the screen along with the sheet. Fixed by taking animation off the `Modal` (`animationType="none"`) and driving two independent `Animated.Value`s — one fades the backdrop in place, the other slides only the sheet.
- **Release builds ship code-shrunk.** `enableProguardInReleaseBuilds` is `true` in `android/app/build.gradle` (it ships `false` in the RN template) — R8 minification cut `classes.dex` from ~9.9MB to ~2.2MB in this app. If you add a library that depends on reflection (some analytics/crash-reporting SDKs do), verify it ships correct consumer Proguard rules before assuming a release build behaves like debug.

## Running the project

```sh
npm install

# Metro (JS bundler) — keep running in its own terminal
npm start

# Android (separate terminal, with Metro running)
npm run android

# iOS — install native deps once, then run
bundle install
bundle exec pod install
npm run ios
```

### Building a release APK

```sh
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

- `-PreactNativeArchitectures=arm64-v8a` restricts native libs to one CPU architecture (what virtually all real Android phones use) instead of bundling all four — this alone is roughly a 2x size reduction. Drop it if you need the APK to also run on an x86/x86_64 emulator.
- Output: `android/app/build/outputs/apk/release/app-release.apk`.
- `./gradlew installRelease` builds and installs directly to a connected device/emulator in one step.

## Testing

`npm test` runs Jest. Coverage today is a single smoke test (`__tests__/App.test.tsx`) that renders `<App />` and asserts it doesn't throw — there's no meaningful screen- or logic-level test coverage yet. Validation logic (`src/utils/validation.ts`) and gender/icon resolution (`src/utils/assessmentIcons.ts`, `src/data/userGender.ts`) are pure functions and would be the highest-value next additions to cover.

## Known limitations / what's stubbed

Being upfront about the state of things, so nobody mistakes placeholder content for a finished feature:

- **No real backend.** `src/services/auth.ts` fabricates a user locally; there's no persistence, no real authentication, no session handling.
- **No real assessment scoring.** The Hair Health Index, diagnosis text, and root-cause breakdown on the results/report screens are hardcoded (`src/data/fullReport.ts`, `ResultsScreen.tsx`) — the 11 answers the user gives aren't actually fed into anything yet.
- **No real checkout.** "Start my plan" on the full report screen loops back into the assessment funnel — there's no payment flow, and the comment in `RootNavigator.tsx` says so.
- **Product photography is a shared placeholder.** All four products reuse the same four-image gallery (`PRODUCT_GALLERY` in `src/data/fullReport.ts`) pending real per-product photography.
- **The app icon is still the default React Native template icon**, not a real Traya mark — worth swapping before this goes anywhere near an app store listing.
