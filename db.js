import pg from "pg";

// parametre almadan sadece basit bir sql sorgusu çalışıtran fonksiyon
// örnek tablo oluştur sil vs.

export const postgresConnection = new pg.Pool({
  host: "database-1.cf1n4shvkpyh.us-east-1.rds.amazonaws.com",
  user: "postgres",
  password: "210201eE",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// postgresql amazon servisindeki konuma bağlanan kısım
