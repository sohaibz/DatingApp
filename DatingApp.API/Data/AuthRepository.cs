using System;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        public DataContext _Context { get; set; }
        public AuthRepository(DataContext context)
        {
            _Context = context;
        }

        public async Task<User> Login(string username, string password)
        {
            User user = await _Context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName.ToLower() == username.ToLower());

            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (System.Security.Cryptography.HMACSHA512 HMA = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                byte[] computedHash = HMA.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.UserName = user.UserName;
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _Context.Users.AddAsync(user);
            await _Context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (System.Security.Cryptography.HMACSHA512 HMA = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = HMA.Key;
                passwordHash = HMA.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists(string username)
        {
            return await _Context.Users.AnyAsync(u => u.UserName.ToLower() == username.ToLower());
        }
    }
}