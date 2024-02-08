// typings.d.ts

// הגדרת טיפוסים עבור המידע המדומה שהמודול מחזיר
interface MockUserInfo {
  email: string;
  name: string;
  picture: string;
}

// הגדרת פונקציה מדומה והטיפוס שלה
interface MockFunctions {
  mockVerifyGoogleUser: () => Promise<MockUserInfo>;
}

// ייצוא הטיפוסים כדי שיהיו נגישים בכל הפרויקט
export { MockUserInfo, MockFunctions };
