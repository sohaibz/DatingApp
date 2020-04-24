using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(DataContext context)
        {
            context.Database.Migrate();

            SeedUsers(context);

            context.SaveChanges();
        }

        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                users.ForEach(u => {
                    byte[] passwordHash, passwordSalt;
                    CreatePasswordHash("123", out passwordHash, out passwordSalt);

                    u.PasswordHash = passwordHash;
                    u.PasswordSalt = passwordSalt;

                    context.Users.Add(u);
                });
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (System.Security.Cryptography.HMACSHA512 HMA = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = HMA.Key;
                passwordHash = HMA.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}