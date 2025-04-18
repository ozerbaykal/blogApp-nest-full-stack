# BlogFullStackApp Postman Collection

Bu dosya, BlogFullStackApp API'sini test etmek için Postman koleksiyonunu nasıl kullanacağınızı açıklar.

## Kurulum

1. [Postman](https://www.postman.com/downloads/)'ı indirin ve yükleyin.
2. İki JSON dosyasını (`BlogFullStackApp.postman_collection.json` ve `BlogFullStackApp.postman_environment.json`) bilgisayarınıza kaydedin.
3. Postman'ı açın ve sol üst köşedeki "Import" düğmesine tıklayın.
4. Her iki JSON dosyasını da içe aktarın.

## Ortamı Yapılandırma

1. Sağ üst köşedeki ortam seçiciden "BlogFullStackApp Environment"ı seçin.
2. Ortam değişkenlerini düzenlemek için dişli simgesine tıklayın.
3. `baseUrl` değerini API'nizin gerçek URL'sine göre ayarlayın (varsayılan olarak `http://localhost:3000`).
4. "Save" düğmesine tıklayın.

## Kimlik Doğrulama ve Tokenları Yönetme

Collection içinde otomatik token yönetimini sağlayan test scriptleri bulunmaktadır:

1. **Kayıt ve Giriş**:

   - Önce "Register" isteğini göndererek bir kullanıcı oluşturun.
   - Sonra "Login" isteğini gönderin. Bu istek otomatik olarak dönen access ve refresh tokenları ortam değişkenlerine kaydedecektir.

2. **Token Yenileme**:

   - Access token süresi dolduğunda "Refresh Token" isteğini gönderin. Bu script otomatik olarak yeni tokenları ortam değişkenlerine kaydedecektir.

3. **Çıkış Yapma**:
   - "Logout" isteğini gönderdiğinizde, script otomatik olarak ortamdaki token değişkenlerini temizleyecektir.

## Endpoints Kullanımı

### Auth Endpointleri

- **Register**: Yeni kullanıcı kaydı için
- **Login**: Kullanıcı girişi ve token alma
- **Refresh Token**: Access token yenileme
- **Logout**: Çıkış yapma ve tokenları geçersiz kılma

### User Endpointleri

- **Get User Profile**: Giriş yapmış kullanıcının profilini alma

### Blog Posts Endpointleri

- **Get All Posts**: Tüm blog yazılarını listeler
- **Get Post by ID**: ID'ye göre belirli bir blog yazısını getirir
- **Create Post**: Yeni bir blog yazısı oluşturur (kimlik doğrulama gerektirir)
- **Update Post**: Mevcut bir blog yazısını günceller (kimlik doğrulama gerektirir)
- **Delete Post**: Bir blog yazısını siler (kimlik doğrulama gerektirir)

## Test Scriptleri

Collection içinde, aşağıdaki işlevleri gerçekleştiren test scriptleri bulunmaktadır:

1. **Login İsteği**:

   ```javascript
   const response = pm.response.json();

   if (response.accessToken) {
     pm.environment.set("accessToken", response.accessToken);
     console.log("Access token saved to environment");
   }

   if (response.refreshToken) {
     pm.environment.set("refreshToken", response.refreshToken);
     console.log("Refresh token saved to environment");
   }
   ```

2. **Refresh Token İsteği**:

   ```javascript
   const response = pm.response.json();

   if (response.accessToken) {
     pm.environment.set("accessToken", response.accessToken);
     console.log("Access token refreshed and saved to environment");
   }

   if (response.refreshToken) {
     pm.environment.set("refreshToken", response.refreshToken);
     console.log("Refresh token updated and saved to environment");
   }
   ```

3. **Logout İsteği**:
   ```javascript
   if (pm.response.code === 200) {
     pm.environment.unset("accessToken");
     pm.environment.unset("refreshToken");
     console.log("Tokens removed from environment after successful logout");
   }
   ```

Bu scriptler, API ile etkileşimde bulunurken tokenları otomatik olarak yönetmenizi sağlar.

## Hata Ayıklama

- İstek başarısız olursa, Postman'ın "Console" sekmesinde ve Response bölümünde ayrıntılı hata mesajlarını kontrol edin.
- Token ile ilgili hatalar için ortam değişkenlerinin doğru ayarlandığından emin olun.
- API sunucusunun çalıştığından ve baseUrl'nin doğru yapılandırıldığından emin olun.
